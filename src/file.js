import React from 'react';
import {Observable, Subject} from 'rxjs/Rx'

export const File = (props) => {
    let imageSrc = ''
    let onFileChange$ = new Subject()
    onFileChange$
        .map(e => e.target.files[0])
        .switchMap(file => readerFile(file))
        .map((imageSrc) => props.onImageLoaded(imageSrc))
        .subscribe(console.dir)

    let readerFile = (file) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        return Observable
            .fromEvent(reader, 'load')
            .map(e => e.target.result)
    }

    let imageLoaded = (imageData) => {
        const image = new Image()
        image.src = imageData
        // return fromEvent(image, 'load').map(e => e.target)
    }
    return (
        <section>
            <img src={props.imageSrc} id="preview"/>
            <input type="file" onChange={(e)=>onFileChange$.next(e)} id="file-upload"/>
            <div class="adjustment"></div>
        </section>
    )
}