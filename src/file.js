import React from 'react';
import { Observable, Subject } from 'rxjs/Rx'
import { Link } from 'react-router-dom'

export const File = (props) => {
    const onFileChange$ = new Subject()

    onFileChange$
        .map(e => e.target.files[0])
        .switchMap(file => {
            if (!file || !(file.type.indexOf("image") === 0))
                return Observable.never()
            if (file.type.indexOf("image") === 0)
                return readerFile(file)
        }).switchMap((image) =>
            getImage$(image))
        .do((image) =>
            props.onImageLoaded(image))
        .subscribe()

    const getImage$ = (data) => {
        let image = new Image()
        image.src = data
        return Observable.fromEvent(image, 'load').mapTo(image)
    }

    const readerFile = (file) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        return Observable
            .fromEvent(reader, 'load').do(console.warn)
            .map(e => e.target.result)
    }
    return (
        <section>
            <div className="adjustment"></div>
            <figure>
                <img src={props.imageSrc} id="preview" />
            </figure>
            {props.imageSrc ?
                <Link to='/pixelate'><button>Pixelate It</button></Link>
                :
                <div>
                    <input type="file" className="file-upload" onChange={(e) => onFileChange$.next(e)} id="file-upload" />
                    <label htmlFor="file" className="btn">Choose a file</label>
                </div>}
        </section>
    )
}