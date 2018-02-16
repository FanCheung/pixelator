import React, { Component } from 'react'
import { Observable } from 'rxjs/Rx'
import { Redirect } from 'react-router-dom'

export class CameraCapture extends Component {
    state = { captured: false, a: 'k' }
    saved = false

    constructor(props) {
        super(props)
    }

    componentDidMount() {

        let setState = (data) =>
            Observable.create(obs => { this.setState(data, () => obs.next(data)) })

        this.capture = () => {
            const context = this.canvas.getContext('2d');
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
                    id="player" ref={el => this.player = el} autoPlay="true"></video>
                <canvas className="" id="canvas" ref={el => this.canvas = el} width="320" height="240" ></canvas>
                {this.state.captured ?
                    <div>
                        <button id="save-image" onClick={() => this.saveImage()}>
                            <i class="material-icons">check</i>
                        </button>
                        <button id="cancel" className="secondary" onClick={() => this.cancel()}>
                            <i class="material-icons">close</i>
                        </button>
                    </div>
                    :
                    <div>
                        <button id="capture" onClick={() => this.capture()}>
                            <i class="material-icons">photo_camera</i>
                        </button>
                    </div>}
            </section>
        )
    }
}
