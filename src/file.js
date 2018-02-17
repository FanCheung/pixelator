import React, { Component } from 'react';
import { Observable, Subject } from 'rxjs/Rx'
import { Link } from 'react-router-dom'

export class File extends Component {

    onFileChange$ = new Subject()

    constructor(props) {
        super(props)
        this.props.setTitle('File Upload')
        this.onFileChange$
            // .do(console.log)
            .map(e => e.target.files[0])
            .switchMap(file => {
                if (!file || !(file.type.indexOf("image") === 0))
                    return Observable.never()
                if (file.type.indexOf("image") === 0)
                    return this.readerFile(file)
            }).switchMap((image) =>
                this.getImage$(image))
            .do((image) =>
                this.props.onImageLoaded(image))
            .subscribe()
    }

    componentdidMount() {
    }
    componentWillUnmount() {
        if (this.player)
            this.player.srcObject.getVideoTracks().forEach(track => track.stop());
    }
    cancel() {
        this.props.onImageLoaded({})
    }

    getImage$(data) {
        let image = new Image()
        image.src = data
        return Observable.fromEvent(image, 'load').mapTo(image)
    }

    readerFile(file) {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        return Observable
            .fromEvent(reader, 'load').do(console.warn)
            .map(e => e.target.result)
    }

    render() {
        return (
            <section>
                <div className="adjustment"></div>
                <figure>
                    <img src={this.props.imageSrc} id="preview" />
                </figure>
                {this.props.imageSrc ?
                    <div>
                        <Link to='/pixelate'>
                            <button id="save-image">
                                <i className="material-icons">check</i>
                            </button>
                        </Link>
                        <button id="cancel" className="secondary" onClick={() => this.cancel()}>
                            <i className="material-icons">close</i>
                        </button>
                    </div>
                    :
                    <div>
                        <input type="file" className="file-upload" onChange={(e) => this.onFileChange$.next(e)} id="file-upload" />
                        <label htmlFor="file" className="btn icon">
                        <i className="material-icons">image</i> 
                        <span>Choose a file</span>
                        </label>
                    </div>}
            </section>
        )
    }
}