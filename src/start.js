import React from 'react'
import { Link } from 'react-router-dom'

export class Start extends React.Component {
    render() {
        return (
            <section>
                <header>
                    <h1>Pixelator</h1>
                    <span> have fun in making pixel art </span>
                </header>

                <Link className="btn icon" role="button"
                    to='/file-upload'>
                    <i className="material-icons">file_upload</i>
                    <span>Upload image</span>
                </Link>
                <Link className="btn icon" role="button"
                    to='/camera-capture' >
                    <i className="material-icons">photo_camera</i>
                    <span>Take picture</span></Link>
            </section>

        )
    }
}
