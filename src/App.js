import React, {Component} from 'react'
import {Observable, Subject} from 'rxjs/Rx'
import {map, fromEvent, of, from} from 'rxjs/Rx'
import logo from './logo.svg'
import './App.css'
import * as CanvasHelper from './canvas-helper'
var convert = require('color-convert');

class App extends Component {
  constructor() {
    super()
    this.image = new Image()
  }

  config() {
    const resolution = 32
    let minDimension = 64
    let scale = 1
    // set sprite to pixel art dimension
    this.sprite.height = HEIGHT * scale;
    this.sprite.width = WIDTH * scale;
    const ctxSprite = this
      .sprite
      .getContext('2d')
    ctxSprite.mozImageSmoothingEnabled = false;
    ctxSprite.webkitImageSmoothingEnabled = false;
    ctxSprite.imageSmoothingEnabled = false;

    return of({resolution, minDimension, scale, ctxSprite})
  }

  componentDidMount() {

    config().map((e) => e)

    fromEvent(document.querySelector('#file-upload'), 'change').do 
      (event => {
        let file = event.target.files[0];
        if (file.type.indexOf("image") === 0) {
          reader.readAsDataURL(file);
        }
      })

    let resolutionChange = fromEvent(this.resolution, 'change').map(e => e.target.value)
    let fileRead = fromEvent(new FileReader(), 'load')
    let draw = () => fileRead.map()
    let imageLoaded = fromEvent(new Image(), 'load').map(img => {})
    let trimmedDemension = 0

    let getOptimisedDimension = (img) => {
      return (img.width < img.height)
        ? img.width
        : img.height
    }

    ctxSprite.drawImage(image, 0, 0, trimmedDemension, trimmedDemension, 0, 0, HEIGHT / BLOCK_SIZE, WIDTH / BLOCK_SIZE)
    // ctxSprite.drawImage(sprite, 0, 0, WIDTH / BLOCK_SIZE, HEIGHT / BLOCK_SIZE, 0,
    // 0, WIDTH, HEIGHT)
    ctxSprite.drawImage(sprite, 0, 0, RESOLUTION, RESOLUTION, 0, 0, WIDTH * 2, HEIGHT * 2)
    // context.drawImage(image, 0, 0, preview.width, preview.height) round to 256
    let colorData = ctxSprite
      .getImageData(0, 0, WIDTH, HEIGHT)
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

    var imageData = new ImageData(new Uint8ClampedArray(data), HEIGHT, WIDTH)
    ctxSprite.putImageData(imageData, 0, 0)
    window
      .localStorage
      .setItem('sprite', JSON.stringify(imageData))

    // window.requestAnimationFrame = (function () {     return
    // window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
    // window.mozRequestAnimationFrame || function (callback) {
    // window.setTimeout(callback, 1000 / 60);     }; })();

    CanvasHelper.drawGrid()
  }

  eidtorMode() {}
  // var uri = canvas.toDataURL('image/png');
  // $('#draw-bg').css('background-image', 'url(' + uri + ')');

  componentWillUnmount() {}
  render() {
    return (
      <div className="app">
        {/* control the conversion scale */}
        <label>Resolution
          <input
            type="range"
            ref={el => this.resolution = el}
            name="resolution"
            min="1"
            max="3"/>
        </label>
        <canvas id="sprite" ref= { el => this.sprite = el }></canvas >
        <input type="file" ref= { el => this.file = el } id="file-upload"/>
        <section id="editor">
          <canvas ></canvas>
        </section>
      </div>
    )
  }
}
export default App;
