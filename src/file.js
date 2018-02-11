import React from 'react';
import {Observable, Subject} from 'rxjs/Rx'
import {Link} from 'react-router-dom'
export const File = (props) => {
    let imageSrc = ''

    const onFileChange$ = new Subject()
    onFileChange$
        .map(e => e.target.files[0])
        .switchMap(file => {
            if (!file || !(file.type.indexOf("image") === 0)) 
                return Observable.never()
            if (file.type.indexOf("image") === 0) 
                return readerFile(file)
        })
        .map((imageSrc) => props.onImageLoaded(imageSrc))
        .subscribe(console.dir)

    const readerFile = (file) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        return Observable
            .fromEvent(reader, 'load')
            .map(e => e.target.result)
    }

    const imageLoaded = (imageData) => {
        const image = new Image()
        image.src = imageData
        // return fromEvent(image, 'load').map(e => e.target)
    }
    return (
        <section>
            <img src={props.imageSrc} id="preview"/>
            <input type="file" onChange={(e) => onFileChange$.next(e)} id="file-upload"/>
            <div class="adjustment"></div>
            <Link to='/pixelate'>Pixelate It</Link>
        </section>
    )
}