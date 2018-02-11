import code from './worker'
import React, {Component} from 'react'
import {Observable, Subject} from 'rxjs/Rx'
import './App.css'
import * as CanvasHelper from './canvas-helper'
import {Switch, BrowserRouter, Route} from 'react-router-dom'
import {Editor} from './editor'
import {File} from './file'
import {Pixelator} from './pixelator'

var convert = require('color-convert');
const blob = new Blob([code], {type: "application/javascript"});
const work = new Worker(URL.createObjectURL(blob));

work.onmessage = (m) => {};
work.postMessage('')

export class App extends Component {
  constructor() {
    super()
    this.onImageLoaded$ = new Subject()
    this.state = {
      imageSrc: ''
    }
  }

  componentDidMount() {
    this
      .onImageLoaded$
      .map((e) => this.setState({imageSrc: e})).subscribe()
  }
  // var uri = canvas.toDataURL('image/png');
  // $('#draw-bg').css('background-image', 'url(' + uri + ')');
  render() {
    console.log(this.state)
    return (
      <Switch>
        <Route path="/editor" render={() => Editor}/>
        <Route
          path="/"
          render={() => <File
          imageSrc={this.state.imageSrc}
          onImageLoaded={e => this
          .onImageLoaded$
          .next(e)}/>}/>
        <Route path="/pixelate" component={Pixelator}/>
      </Switch>
    )
  }
}
