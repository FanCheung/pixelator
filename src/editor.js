import React, {Component} from 'react'
import {Observable, Subject} from 'rxjs/Rx'
import logo from './logo.svg'
import './App.css'
import * as CanvasHelper from './canvas-helper'

var convert = require('color-convert');
const fromEvent = Observable.fromEvent;
const from = Observable.from;
const of = Observable.of;

export const Editor = (props) => {
    return (<input type="text"/>)
}
