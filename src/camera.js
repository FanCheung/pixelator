
import React from 'react';

const CameraCapture = (props) => {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true }, () => {
      videoNode.src = window.URL.createObjectURL(stream);
    }, (err) => console.warn(err));
  }

  return (
    <section>
      <video autoplay="true" src={props.videoSrc} id="video" ref={el => videoNode = el}> </video>
      <button>Shoot</button>
    </section>
  )
}