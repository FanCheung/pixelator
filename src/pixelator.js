import code from './worker'
import React, {Component} from 'react'
import {Observable, Subject} from 'rxjs/Rx'
import logo from './logo.svg'
import * as CanvasHelper from './canvas-helper'

var convert = require('color-convert');
const blob = new Blob([code], {type: "application/javascript"});
const work = new Worker(URL.createObjectURL(blob));

work.onmessage = (m) => {};
work.postMessage('')

export const Pixelator = (props) => {

    const fromEvent = Observable.fromEvent;
    const from = Observable.from;
    const of = Observable.of;
    // config().map((e) => e)
    const resolution = 32
    let minDimension = 64
    // set sprite to pixel art dimension
    const ctxSprite = this
        .sprite
        .getContext('2d');
    let scale = 1
    let blockSize = 1

    ctxSprite.mozImageSmoothingEnabled = false;
    ctxSprite.webkitImageSmoothingEnabled = false;
    ctxSprite.imageSmoothingEnabled = false;

    let fileUploaded = Observable
        .fromEvent(this.fileUpload, 'change')
        .map(e => e.target.files[0])

    let getOptimisedDimension = (image) => {
        let ratio = image.width / image.height;
        return ratio > 1
            ? {
                height: resolution,
                width: Math.floor(ratio * resolution)
            }
            : {
                width: resolution,
                height: Math.floor(resolution / ratio)
            }
    }

    const getImageData256 = (canvas, width, height) => {
        let colorData = canvas
            .getContext('2d')
            .getImageData(0, 0, width, height)
            .data
        // TODO: remove temp and improve algorithm
        let data = colorData.reduce((acc, curr, index, arr) => {
            // let key = Math.floor(index / 4)
            acc
                .temp
                .push(curr)
            if (acc.temp.length === 4) {
                const ansi = convert
                    .rgb
                    .ansi256(...acc.temp)
                const rounded = convert
                    .ansi256
                    .rgb(ansi)
                    .concat(255)
                acc.data = acc
                    .data
                    .concat(rounded)
                acc.temp = []
            }
            return acc
        }, {
            temp: [],
            data: []
        }).data
        return new ImageData(new Uint8ClampedArray(data), width, height)
    }

    const drawPixels = (obj, scale, blockSize) => {
        let {width, height} = obj.dimension
        // add blocksize, this will compute correct shrinked size for pixel enlargement
        let shrinkWidth = Math.floor(width / blockSize)
        let shrinkHeight = Math.floor(height / blockSize)
        let image = obj.image

        this.sprite.width = width * scale
        this.sprite.height = height * scale

        ctxSprite.drawImage(image, 0, 0, image.width, image.height, 0, 0, shrinkWidth, shrinkHeight)
        const id = getImageData256(this.sprite, shrinkWidth, shrinkHeight)
        ctxSprite.putImageData(id, 0, 0)
        ctxSprite.mozImageSmoothingEnabled = false;
        ctxSprite.webkitImageSmoothingEnabled = false;
        ctxSprite.imageSmoothingEnabled = false;

        ctxSprite.drawImage(this.sprite, 0, 0, shrinkWidth, shrinkHeight, 0, 0, width * scale, height * scale)

        console.log(shrinkWidth, shrinkHeight, blockSize, width, height, scale)

        // JSON.stringify(imageData)) window.requestAnimationFrame = (function () {
        // return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
        // window.mozRequestAnimationFrame || function (callback) {
        // window.setTimeout(callback, 1000 / 60);     }; })();
    }
    const onScaleChange = new Subject()
    const onBlockSizeChange = new Subject()
    Observable
        .of(props.imageData)
        .map(image => ({dimension: getOptimisedDimension(image), image}))
        .switchMap(value => onScaleChange.startWith(scale).combineLatest(onBlockSizeChange.startWith(blockSize)), (inner, outer) => [inner, outer])
        .map(([
            obj,
            [scale, blockSize]
        ]) => drawPixels(obj, scale, blockSize))
        .subscribe(console.log)
    // CanvasHelper.drawGrid() var uri = canvas.toDataURL('image/png');
    // $('#draw-bg').css('background-image', 'url(' + uri + ')');
    return (
        <section>
            <PixelSetting
                scale={scale}
                blockSize={blockSize}
                onScaleChange={(e) => onScaleChange.next(e)}
                onBlockSizeChange={(e) => onBlockSizeChange.next(e)}/>
            <canvas id="sprite"></canvas >
            <img src={props.pixelData}/>
        </section>
    )
}

const PixelSetting = (props) => {
    return (
        <section class="setting">
            <label>
                Block size
                <input
                    type="range"
                    name="block-size"
                    min="1"
                    max="3"
                    value={props.blockSize}
                    change={(e) => props.onBlockSizeChange(e.target.value)}/>
            </label>
            <label>
                Scale
                <input
                    type="range"
                    name="scale"
                    min="1"
                    max="5"
                    value={props.scale}
                    change={(e) => props.onScaleChange(e.target.value)}/>
            </label>
        </section>
    )
}