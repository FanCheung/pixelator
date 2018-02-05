import React, {Component} from 'react'
import {Observable, Subject} from 'rxjs/Rx'
import logo from './logo.svg'
import './App.css'
import * as CanvasHelper from './canvas-helper'
var convert = require('color-convert');

class App extends Component {
  constructor() {
    super()
  }

  componentDidMount() {

    const RESOLUTION = 32
    const BLOCK_SIZE = 1

    const WIDTH = 32
    const HEIGHT = 32

    const reader = new FileReader()
    let image = new Image()
    let {sprite} = this

    // set sprite to pixel art dimension
    sprite.height = HEIGHT * 2;
    sprite.width = WIDTH * 2;

    const contextSprite = sprite.getContext('2d')

    contextSprite.mozImageSmoothingEnabled = false;
    contextSprite.webkitImageSmoothingEnabled = false;
    contextSprite.imageSmoothingEnabled = false;

    reader.onload = (e) => {
      image.src = e.target.result;
    }

    image.onload = (img) => {
      // clear() preview.height = image.height preview.width = image.width
      let trimmedDemension = 0
      trimmedDemension = (image.width < image.height)
        ? image.width
        : image.height

      contextSprite.drawImage(image, 0, 0, trimmedDemension, trimmedDemension, 0, 0, HEIGHT / BLOCK_SIZE, WIDTH / BLOCK_SIZE)
      // contextSprite.drawImage(sprite, 0, 0, WIDTH / BLOCK_SIZE, HEIGHT /
      // BLOCK_SIZE, 0, 0, WIDTH, HEIGHT)
      contextSprite.drawImage(sprite, 0, 0, RESOLUTION, RESOLUTION, 0, 0, WIDTH * 2, HEIGHT * 2)
      // context.drawImage(image, 0, 0, preview.width, preview.height) round to 256
      let colorData = contextSprite
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
      contextSprite.putImageData(imageData, 0, 0)
      window
        .localStorage
        .setItem('sprite', JSON.stringify(imageData))

      //   window.requestAnimationFrame = (function () {     return
      // window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
      // window.mozRequestAnimationFrame || function (callback) {
      // window.setTimeout(callback, 1000 / 60);     }; })();
    }

    document
      .querySelector('#file-upload')
      .addEventListener('change', (event) => {
        let file = event.target.files[0];
        if (file.type.indexOf("image") === 0) {
          reader.readAsDataURL(file);
        }
      });

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
            max="4"
            max="7"/>
        </label>

        <canvas id="sprite" ref= { el => this.sprite = el }></canvas >
        <input type="file" id="file-upload"/>
        <section id="editor">
          <canvas ></canvas>
        </section>
      </div>
    )
  }
}
export default App;
