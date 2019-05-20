import React, { useState, useEffect } from 'react';
import {useDropzone} from 'react-dropzone';
import css from './DropZone.module.scss';

const dropZone = props => {

  const [currentImageURL, setCurrentImageURL] = useState('');

  useEffect(() => {
    setCurrentImageURL(props.imageUrl ? props.imageUrl : '');
  }, []);

  const onDrop = acceptedFile => {
    props.selectedImage(acceptedFile[0]);
  };
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/jpg, image/png'
  });

  const getImageURL = () => {
    if(currentImageURL){
      return currentImageURL;
    } else if(props.imageFile){
      return URL.createObjectURL(props.imageFile);
    } return false;
  }

  const deleteImage = () => {
    props.delete();
    setCurrentImageURL('');
  }
  
  return (
    getImageURL() ? 
    <div
      style={{backgroundImage: 'url(' + getImageURL() + ')'}}
      className={`${css.imagePreview} ${css[props.type]}`}
    >
      <button className={css.delete} onClick={deleteImage}/>
    </div>:
    <div {...getRootProps()} className={`${css.dragAndDropArea} ${css[props.type]}`}>
      <input {...getInputProps()} />
      {props.placeholder ?
        <p className={css.placeholder}>{props.placeholder}</p>:
        <p className={css.placeholder}>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}




export default dropZone;