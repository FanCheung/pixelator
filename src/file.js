import React from 'react';
import { Observable, Subject } from 'rxjs/Rx'
import { Link } from 'react-router-dom'
/**
 * 
 */
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
            <img src={props.imageSrc} id="preview" />
            <button>Upload</button>
            <button>From camera</button>
            <input type="file" onChange={(e) => onFileChange$.next(e)} id="file-upload" />
            <div className="adjustment"></div>
            <Link to='/pixelate'>Pixelate It</Link>
        </section>
    )
}