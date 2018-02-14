import React, { Component } from 'react'
import { Observable } from 'rxjs/Rx'
export class CameraCapture extends Component {

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
            this.props.onImageLoaded(this.imageData)
        }

        navigator.mediaDevices.getUserMedia({
            video: true,
        }).then((stream) => {
            this.player.srcObject = stream;
        })
    }

    render() {
        return (
            <section>
                <video className=""
                    id="player" width="480" height="480" ref={el => this.player = el} autoPlay="true"></video>
                <canvas className="" id="canvas" ref={el => this.canvas = el} width="320" height="240" ></canvas>
                {this.state.captured ?
                    <div>
                        <button id="convert" ref={el => this.convert = el} onClick={() => this.saveImage()}>Pixelate it</button>
                        <button id="cancel" ref={el => this.cancel = el} onClick={() => this.cancel()}>Cancel</button>
                    </div>
                    :
                    <div>
                        <button id="capture" ref={el => this.capture = el} onClick={() => this.capture()}>Capture</button>
                    </div>}
            </section >
        )
    }
}
