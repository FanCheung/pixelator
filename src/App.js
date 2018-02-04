import React, {Component} from 'react'
import {Observable, Subject} from 'rxjs/Rx'
import logo from './logo.svg'
import './App.css'
var convert = require('color-convert');

class App extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    const BLOCK_SIZE = 2
    const WIDTH = 64
    const HEIGHT = 64
    const reader = new FileReader()
    let image = new Image()
    let {preview, sprite} = this

    // set sprite to pixel art dimension
    sprite.height = HEIGHT;
    sprite.width = WIDTH;

    const context = preview.getContext('2d')
    const contextSprite = sprite.getContext('2d')

    contextSprite.mozImageSmoothingEnabled = false;
    contextSprite.webkitImageSmoothingEnabled = false;
    contextSprite.imageSmoothingEnabled = false;

    reader.onload = (e) => {
      image.src = e.target.result;
    }

    image.onload = (img) => {
      clear()
      preview.height = image.height
      preview.width = image.width

      let trimmedDemension = 0
      trimmedDemension = (image.width < image.height)
        ? image.width
        : image.height

      contextSprite.drawImage(image, 0, 0, trimmedDemension, trimmedDemension, 0, 0, HEIGHT / BLOCK_SIZE, WIDTH / BLOCK_SIZE)
      contextSprite.drawImage(sprite, 0, 0, WIDTH / BLOCK_SIZE, HEIGHT / BLOCK_SIZE, 0, 0, WIDTH, HEIGHT)
      // context.drawImage(image, 0, 0, preview.width, preview.height) round to 256
      let colorData = contextSprite
        .getImageData(0, 0, WIDTH, HEIGHT)
        .data

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
      console.log(colorData.length)
      console.log(data.length)
      var imageData = new ImageData(new Uint8ClampedArray(data), HEIGHT, WIDTH)
      contextSprite.putImageData(imageData, 0, 0)

    }

    const round256 = (colorData) => {}
    const clear = () => context.clearRect(0, 0, preview.width, preview.height)
    document
      .querySelector('#file-upload')
      .addEventListener('change', (event) => {
        let file = event.target.files[0];
        if (file.type.indexOf("image") === 0) {
          reader.readAsDataURL(file);
        }
      });
  }

  eidtorMode() {}

  buildGrid(canvas, gridPixelSize, gridColor, gridGap) {

    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = gridColor;

    for (var i = 0; i <= canvas.height; i = i + gridPixelSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      if (i % parseInt(gridGap) == 0) {
        ctx.lineWidth = 2;
      } else {
        ctx.lineWidth = 0.5;
      }

      ctx.closePath();
      ctx.stroke();
    }

    for (var j = 0; j <= canvas.width; j = j + gridPixelSize) {
      ctx.beginPath();
      ctx.moveTo(j, 0);
      ctx.lineTo(j, canvas.height);
      if (j % parseInt(gridGap) == 0) {
        ctx.lineWidth = 2;
      } else {
        ctx.lineWidth = 0.5;
      }
      ctx.closePath();
      ctx.stroke();
    }
    // var uri = canvas.toDataURL('image/png');
    // $('#draw-bg').css('background-image', 'url(' + uri + ')');

  }
  componentWillUnmount() {}
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          To get started, edit and save to reload.
        </p>
        <canvas id="pic" ref={el => this.preview = el}></canvas>
        <canvas id="sprite" ref={el => this.sprite = el}></canvas>
        <input type="file" id="file-upload"/>
      </div>
    );
  }
}

export default App;
