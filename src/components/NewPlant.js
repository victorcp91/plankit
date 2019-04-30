import React, { useState, useEffect, useRef } from 'react';
import {useDropzone} from 'react-dropzone'

import css from './NewPlant.module.scss';


const newPlant = props => {

  const [imageFile, setImageFile] = useState(null);

  const onDrop = acceptedFile => {
    console.log(acceptedFile)
    setImageFile(acceptedFile);
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png'
  })

  return (
    imageFile ? 
    <image src={imageFile} /> :
    <div {...getRootProps()} className={css.dragAndDropArea}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>

  )
  
}

export default newPlant;