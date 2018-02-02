import React, {Component} from 'react'
import {Observable,Subject} from 'rxjs/Rx'
import logo from './logo.svg'
import './App.css'


class App extends Component {
  constructor() {
    super()
  }

  componentDidMount() {

    this.reader = new FileReader()
    this.image = new Image()

    this.reader.onload = (e) => {
      this.image.src = e.target.result;
    }

    this.context = this
      .canvas
      .getContext('2d')

    this.image.onload = () => {
      console.log(this.image.height)
      this
        .context
        .clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.canvas.height = this.image.height
      this.canvas.width = this.image.width
      this
        .context
        .drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height)
    }

    document
      .querySelector('#file-upload')
      .addEventListener('change', (event) => {
        let file = event.target.files[0];
        // is image
        if (file.type.indexOf("image") === 0) {
          this
            .reader
            .readAsDataURL(file);
        }
      });
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          To get started, edit and save to reload.
        </p>
        <canvas id="pic" ref={el => this.canvas = el}></canvas>
        <input type="file" id="file-upload"/>
      </div>
    );
  }
}

export default App;
