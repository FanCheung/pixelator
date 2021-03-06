// TODO: settings in a sperate component
import code from './worker'
import React, { Component } from 'react'
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx'
import { Link } from 'react-router-dom'
var convert = require('color-convert');

const blob = new Blob([code], { type: "application/javascript" });
const work = new Worker(URL.createObjectURL(blob));

work.onmessage = (m) => { };
// work.postMessage('')

export class Pixelator extends Component {
    onCanvasReady$ = new Subject()
    scale = 3
    blockSize = 2
    resolution = 16
    file = null
    constructor(props) {
        super(props)
        this.blockSize$ = new BehaviorSubject(this.blockSize)
        this.scale$ = new BehaviorSubject(this.scale)

        let getOptimisedDimension = (image, resolution) => {
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
        this.onCanvasReady$.switchMap(sprite => {
            this.sprite = sprite

            if (!props.image.src || !sprite)
                return Observable.never()
            const ctx = sprite.getContext('2d');
            return Observable
                .of(props.image)
                .map(image => ({ dimension: getOptimisedDimension(image, this.resolution), image }))
                .switchMap((obj) => this.blockSize$.combineLatest(this.scale$).debounceTime(500),
                    (obj, [blockSize, scale]) => drawPixels({ obj, scale, blockSize, ctx, sprite }))
        }).subscribe()


    }

    saveFile() {
        //TODO: combine it to the stream
        this.file.href = this.sprite.toDataURL("image/png")
        this.file.download = 'sprite.png';
        // save to download
    }


    componentDidMount() {
    }
    render() {
        return (
            <section>
                <canvas id="sprite" ref={(e) => this.onCanvasReady$.next(e)}></canvas >
                <div className="setting">
                    <div>
                        <label>
                            Block size
                    </label>
                        <input
                            type="range"
                            name="block-size"
                            min="2"
                            max="6"
                            ref={(e) => e ? e.value = this.blockSize : ''}
                            step="1"
                            defaultValue={this.blockSize}
                            onChange={(e) => this.blockSize$.next(e.target.value)} />
                    </div>
                    <div>
                        <label>
                            Scale
                    </label>
                        <input
                            type="range"
                            name="scale"
                            min="1"
                            max="3"
                            defaultValue={this.scale}
                            onChange={(e) => this.scale$.next(e.target.value)} />
                    </div>
                </div>
                <a className="btn" ref={el => this.file=el} onClick={() => this.saveFile()}>Download</a>
            </section >
        )
    }
}
