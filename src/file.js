import React from 'react';
export const File = (props) => {
    return (
        <section>
            <img src={props.imageSrc} id="preview"/>
            <input type="file" onChange={props.onFileChange} id="file-upload"/>
        </section>
    )
}
