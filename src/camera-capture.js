import React from 'react'
export class CameraCapture extends React.Component {

    componentDidMount() {
        const context = this.canvas.getContext('2d');
        this.capture = () => {
            context.drawImage(this.player, 0, 0, this.canvas.width, this.canvas.height)
        }
        navigator.mediaDevices.getUserMedia({
            video: true,
        })
            .then((stream) => {
                this.player.srcObject = stream;
            })
    }

    render() {
        return (
            <section>
                <video id="player" ref={el => this.player = el}  autoPlay="true"></video>
                <button id="capture" ref={el => this.capture = el} onClick={() => this.capture()}>Capture</button>
                <canvas id="canvas" ref={el => this.canvas = el} width="320" height="240" ></ canvas>
            </section >
        )
    }
}


