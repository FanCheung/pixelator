// TODO: settings in a sperate component
import code from './worker'
import React from 'react'
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx'
import { Link } from 'react-router-dom'
var convert = require('color-convert');

const blob = new Blob([code], { type: "application/javascript" });
const work = new Worker(URL.createObjectURL(blob));

work.onmessage = (m) => { };
work.postMessage('')


export const Pixelator = (props) => {
    const onCanvasReady$ = new Subject()
    let scale = 1
    let blockSize = 1
    const resolution = 16
    const blockSize$ = new BehaviorSubject(blockSize)
    const scale$ = new BehaviorSubject(scale)

    let getOptimisedDimension = (image) => {
        let ratio = image.width / image.height;
        return ratio > 1 ?
            { height: resolution, width: Math.floor(ratio * resolution) }
            : { width: resolution, height: Math.floor(resolution / ratio) }
    }

    const getImageData256 = (sprite, width, height) => {
        let colorData = sprite.getContext('2d').getImageData(0, 0, width, height)
            .data
        // TODO: remove temp and improve algorithm
        let data = colorData.reduce((acc, curr, index, arr) => {
            // let key = Math.floor(index / 4)
            acc.temp.push(curr)
            if (acc.temp.length === 4) {
                const ansi = convert.rgb.ansi256(...acc.temp)
                const rounded = convert.ansi256.rgb(ansi).concat(255)
                acc.data = acc.data.concat(rounded)
                acc.temp = []
            }
            return acc
        }, {
                temp: [],
                data: []
            }).data

        return new ImageData(new Uint8ClampedArray(data), width, height)
    }

    const drawPixels = ({ sprite, obj, scale, blockSize }) => {

        const { width, height } = obj.dimension
        const image = obj.image
        // add blocksize, this will compute correct shrinked size for pixel enlargement
        let shrinkWidth = Math.floor(width * (2 ** scale) / blockSize)
        let shrinkHeight = Math.floor(height * (2 ** scale) / blockSize)

        sprite.width = width * (2 ** scale)
        sprite.height = height * (2 ** scale)

        const ctx = sprite.getContext('2d')

        window.requestAnimationFrame(() => {
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, shrinkWidth, shrinkHeight)
            const imageData = getImageData256(sprite, shrinkWidth, shrinkHeight)
            ctx.putImageData(imageData, 0, 0)
            // pixelize it
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(sprite, 0, 0, shrinkWidth, shrinkHeight, 0, 0, width * (2 ** scale), height * (2 ** scale))
        })
        console.log(shrinkWidth, shrinkHeight, blockSize, width, height, scale)
        // JSON.stringify(imageData)) 
    }
    // CanvasHelper.drawGrid() var uri = canvas.toDataURL('image/png');
    // $('#draw-bg').css('background-image', 'url(' + uri + ')');
    onCanvasReady$.switchMap(sprite => {
        if (!props.image.src || !sprite)
            return Observable.never()
        const ctx = sprite.getContext('2d');
        return Observable
            .of(props.image)
            .map(image => ({ dimension: getOptimisedDimension(image), image }))
            .switchMap((obj) => blockSize$.combineLatest(scale$).debounceTime(500),
                (obj, [blockSize, scale]) => drawPixels({ obj, scale, blockSize, ctx, sprite }))
    }).subscribe()
    const openEditor = () => {

    }

    return (
        <section>
            <section className="setting">
                <label>
                    Block size
                    <input
                        type="range"
                        name="block-size"
                        min="1"
                        max="6"
                        step="1"
                        defaultValue={blockSize}
                        onChange={(e) => blockSize$.next(e.target.value)} />
                </label>
                <label>
                    Scale
                    <input
                        type="range"
                        name="scale"
                        min="1"
                        max="3"
                        defaultValue={scale}
                        onChange={(e) => scale$.next(e.target.value)} />
                </label>
            </section>
            <canvas id="sprite" ref={(e) => onCanvasReady$.next(e)}></canvas >
            <button onClick={() => openEditor()}>Open in Editor</button>
            {/* <img src={props.pixelData}  /> */}
        </section>
    )
}
