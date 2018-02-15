import React, { Component } from 'react'
import { Observable } from 'rxjs/Rx'
import { Redirect } from 'react-router-dom'

export class CameraCapture extends Component {
    saved = false
    constructor(props) {
        super(props)
        this.state = { captured: false, a: 'k' }
    }

    componentDidMount() {

        let setState = (data) =>
            Observable.create(obs => { this.setState(data, () => obs.next(data)) })

        this.capture = () => {
            const context = this.canvas.getContext('2d');
            console.log(this.player)
            context.drawImage(this.player, 0, 0, this.canvas.width, this.canvas.height)
            this.imageData = this.canvas.toDataURL()
            this.setState({ captured: true })
        }

        this.saveImage = () => {
            let image = new Image()
            image.onload = () => {
                this.props.onImageLoaded(image)
            }
            image.src = this.imageData
            this.saved = true
        }

        this.cancel = () => {
            this.setState({ captured: false })
        }

        navigator.mediaDevices.getUserMedia({
            video: true,
        }).then((stream) => {
            this.player.srcObject = stream;
        })
    }

    render() {
        if (this.saved)
            return <Redirect to="/pixelate" />
        return (
            <section>
                <video className=""
                    id="player" width="480" height="480" ref={el => this.player = el} autoPlay="true"></video>
                <canvas className="" id="canvas" ref={el => this.canvas = el} width="320" height="240" ></canvas>
                {this.state.captured ?
                    <div>
                        <button id="save-image" onClick={() => this.saveImage()}>Pixelate it</button>
                        <button id="cancel" onClick={() => this.cancel()}>Cancel</button>
                    </div>
                    :
                    <div>
                        <button id="capture" ref={el => this.capture = el} onClick={() => this.capture()}>Capture</button>
                    </div>}
            </section >
        )
    }
}
