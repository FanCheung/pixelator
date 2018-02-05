import React, {Component} from 'react'
import CanvasHelper from './canvas-helper'

export class Editor extends Component {

    constructor() {}

    componentDidMount(){
        CanvasHelper.drawGrid()
//draw grid
    }
    reder() {
        return <section id="editor">
            <canvans></canvas>
        </section>
    }
}