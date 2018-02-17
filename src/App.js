import code from './worker'
import React, { Component } from 'react'
import { Subject } from 'rxjs/Rx'
import './app.scss'
import * as CanvasHelper from './canvas-helper'
import { Switch, BrowserRouter, withRouter, Route } from 'react-router-dom'
import { Editor } from './editor'
import { File } from './file'
import { Pixelator } from './pixelator'
import { CameraCapture } from './camera-capture'
import { Start } from './start'
import { BrowserHistory } from 'react-router'

// window.requestAnimationFrame = (function () {
//   return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
//     window.mozRequestAnimationFrame || function (callback) {
//       window.setTimeout(callback, 1000 / 60);
//     };
// })();

var convert = require('color-convert');
const blob = new Blob([code], { type: "application/javascript" });
const work = new Worker(URL.createObjectURL(blob));

work.onmessage = (m) => { };
work.postMessage('')

export class App extends Component {
  onImageLoaded$ = new Subject()
  onScaleChange$ = new Subject()
  onBlockSizeChange$ = new Subject()
  onCanvasReady$ = new Subject()

  constructor() {
    super()
    this.state = {
      image: {},
      title: ''
    }
  }

  setTitle(title) {
    this.setState({ title })
  }

  componentDidMount() {
    this.setState({ image: {} })
    this
      .onImageLoaded$
      .map((e) => this.setState({ image: e }))
      .subscribe()
  }
  // var uri = canvas.toDataURL('image/png');
  // $('#draw-bg').css('background-image', 'url(' + uri + ')');
  render() {
    console.log(this)
    let pageName = this.props.location.pathname.replace('/', '')
    if (!pageName.length) pageName = 'home'
    return (
      <main id={'page-' + pageName}>
        <nav className="nav">
          <div className="nav-left"><Back/></div>
          <div className="nav-title">{this.state.title}</div>
          <div className="nav-right"></div>
        </nav>
        <Switch>
          <Route path="/editor" render={() => Editor} />
          <Route path="/camera-capture"
            render={() => <CameraCapture setTitle={this.setTitle.bind(this)}
              onImageLoaded={(e) => this.onImageLoaded$.next(e)}
            />} />
          <Route exact
            path="/file-upload"
            render={() => <File
              imageSrc={this.state.image.src}
              setTitle={this.setTitle.bind(this)}
              onImageLoaded={e => this.onImageLoaded$.next(e)} />} />
          <Route exact path="/pixelate"
            render={() => <Pixelator image={this.state.image}
              setTitle={this.setTitle.bind(this)}
              scale={1}
              blockSize={2}
            />} />
          <Route path="/" render={() => <Start />} />
        </Switch>
      </main>
    )
  }
}

const Back = withRouter(({ history }) => (
  <button className="back"
    onClick={history.goBack}>
    <i className="material-icons">chevron_left</i>
  </button>))