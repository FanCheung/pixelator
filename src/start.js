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

                <Link className="btn" role="button"
                    to='/file-upload'>
                        Upload an image
                </Link>
                <Link className="btn" role="button"
                to='/camera-capture' className="btn"> Take a picture</Link>
            </section>

        )
    }
}
