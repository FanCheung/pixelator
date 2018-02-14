import React from 'react'
import { Link } from 'react-router-dom'

export class Start extends React.Component {
    render() {
        return (
            <section>
                <h1>Pixelator</h1>
                <span> square your pictures </span>
                <Link to='/file-upload'>Upload an image</Link>
                <Link to='/camera-capture'> Take a picture</Link>
            </section>

        )
    }
}
