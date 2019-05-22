import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { comparableString } from '../libs/Utils';
import { setPlants } from '../store/plants';
import Api from '../libs/Api';
import css from './NewPost.module.scss';
import moment from 'moment';

import DropZone from './DropZone';
import Search from './Search';

const newPost = props => {

  const [postImageFile, setPostImageFile] = useState(null);
  const [postImageURL, setPostImageURL] = useState('');
  const [youtubeEmbeddedURL, setYoutubeEmbeddedURL] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [youtubeId, setYoutubeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [postPlants, setPostPlants] = useState([]);

  useEffect(() => {
    let searchTimer = setTimeout(() => {
      if(searchTerm){
        Api.getSearchedPlants(searchTerm).then(plants => {
          setPlants(plants);
        })
      }
    },1500);
    return () => {
      clearTimeout(searchTimer)
    };
  }, [searchTerm]);

  const findOtherName = (names, key) => {
    let contains = false;
    names.forEach(name => {
      if(comparableString(name).includes(key)){
        contains = true;
      }
    });
    return contains;
  }

  const getFilteredPlants = () => {
    let foundPlants = [];
    if(searchTerm){
      const finalKeywords = comparableString(searchTerm).split(' ');
      finalKeywords.forEach(key => {
        foundPlants = props.plants.filter(plant => (comparableString(plant.popularNamePtBr).includes(key) ||
        comparableString(plant.scientificName).includes(key) || findOtherName(plant.otherPopularNamesPtBr, key)));
      });
    }
    postPlants.forEach(postPlant => {
      foundPlants = foundPlants.filter(plant => plant.id !== postPlant.id);
    })
    
    return foundPlants;
  }

  const handleInput = e => {
    const target = e.currentTarget;
    e.persist();
    switch(target.name) {
      case 'postTitle':
        setPostTitle(target.value);
        break;
      case 'postDescription':
        setPostDescription(target.value);
        break;
      case 'channelDescription':
        setPostDescription(target.value);
        break;
      case 'youtubeEmbeddedURL':
        setYoutubeEmbeddedURL(target.value);
        break;
      default: 
        break;
    }
  }

  const createPost = () => {
    let plants = postPlants.map(p => p.id);

    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const content = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');

    Api.createPost({
      author: props.user.uid,
      createdAt: moment().format(),
      publishedAt: moment().format(),
      title: postTitle,
      description: postDescription,
      plants: plants,
      image: postImageURL,
      youtubeId,
      content,
      channel: props.channel.id
    }, postImageFile).then(res => {
      console.log('criado');
    });
  }

  const deletePostImageFile = () => {
    setPostImageFile(null);
    setPostImageURL(null);
  }

  const createFieldsVerification = () => {
    if(postTitle && postTitle .length > 3 && 
      postDescription && postDescription.length > 5 &&
      editorState &&
      (postImageFile || (youtubeEmbeddedURL))) {
        return true;
      }
    return false;
  }

  const postContentChange = content => {
    setEditorState(content);
  }

  const loadYoutubeVideo = () => {

    const getId = url => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = youtubeEmbeddedURL.match(regExp);
  
      if (match && match[2].length == 11) {
          return match[2];
      }
    }
    const videoId = getId('http://www.youtube.com/watch?v=zbYf5_S7oJo');
    setYoutubeId(videoId);
    setPostImageURL(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
  }

  const updateSearchTerm = (term) => {
    setSearchTerm(term)
  }

  const addPostPlant = (plant) => {
    if(postPlants.findIndex(postplant => postplant.id === plant.id) < 0){
      let newPostPlants = [...postPlants];
      newPostPlants.push(plant);
      setPostPlants(newPostPlants);
    }
  }

  const removePostPlant = (plant) => {
    let newPostPlants = postPlants.filter(postPlant => postPlant.id !== plant.id);
    setPostPlants(newPostPlants);
  }

  const createPostDisplay = () => (
    <div className={css.newPostContainer}>
      <input
        className={`${css.field} ${css.title}`}
        placeholder="Título do post"
        value={postTitle}
        name="postTitle"
        onChange={handleInput}
      />
      <input
        className={css.field}
        placeholder="Descrição do post"
        value={postDescription}
        name="postDescription"
        onChange={handleInput}
      />

      <span className={css.youtubeInput}>
        <input
          className={css.field}
          placeholder="Link do vídeo no Youtube"
          value={youtubeEmbeddedURL}
          name="youtubeEmbeddedURL"
          onChange={handleInput}
        />
        <button className={css.loadVideoButton} onClick={loadYoutubeVideo}>Carregar</button>
      </span>

      {youtubeEmbeddedURL && youtubeId &&
        <div className={css.videoContainer}>
          <iframe src={`//www.youtube.com/embed/${youtubeId}`}
            frameBorder='0'
            allow='autoplay; encrypted-media'
            allowFullScreen
            title='video'
            width="100%"
            height="100%"
          />
        </div>
      }
      <label>Foto principal da postagem:</label>
      <DropZone
        imageFile={postImageFile}
        imageUrl={postImageURL ? postImageURL: ''}
        selectedImage={setPostImageFile}
        delete={deletePostImageFile}
        type="post"
        placeholder="Selecione a foto principal da postagem"
      />

      <Editor
        editorState={editorState}
        editorClassName={css.postContentField}
        toolbarClassName={css.postContentToolbar}
        wrapperClassName="wrapperClassName"
        onEditorStateChange={postContentChange}
        toolbar={{
          options: [
            'inline',
            'blockType',
            'fontSize',
            'list',
            'textAlign',
            'colorPicker',
            'embedded',
            'image',
            'link'],
          inline: { inDropdown: true },
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
          },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          embedded: {
            defaultSize: {
              height: 'auto',
              width: 'auto',
            },
          },
        }}
      />
      <label>Plantas relacionadas:</label>
      <div className={`${css.plantsContainer} ${css.added}`}>
        {postPlants.map(plant => (
          <div className={css.plant} key={`current_${plant.id}`}>
            <div className={css.image} style={{backgroundImage: `url(${plant.image})`}} />
            <div className={css.infoContainer}> 
              <div className={css.info}>
                <h1 className={css.mainName}>{plant.popularNamePtBr}</h1>
                {plant.otherPopularNamesPtBr.map(name => <h2 key={name}>{name}</h2>)}
                <h3 className={css.scientificName}>{plant.scientificName}</h3>
              </div>
              <button className={css.button} onClick={() => removePostPlant(plant)}>Remover</button>
            </div>
          </div>
        ))}
      </div>

      <Search
        searchTerm={updateSearchTerm}
        hideSort
      />
      <div className={`${css.plantsContainer}`}>
        {getFilteredPlants().map(plant => (
          <div className={css.plant} key={`add_${plant.id}`}>
            <div className={css.image} style={{backgroundImage: `url(${plant.image})`}} />
            <div className={css.infoContainer}> 
              <div className={css.info}>
                <h1 className={css.mainName}>{plant.popularNamePtBr}</h1>
                {plant.otherPopularNamesPtBr.map(name => <h2 key={name}>{name}</h2>)}
                <h3 className={css.scientificName}>{plant.scientificName}</h3>
              </div>
              <button className={css.button} onClick={() => addPostPlant(plant)}>Adicionar</button>
            </div>
          </div>
        ))}
      </div>
      
      <button
        className={`${css.sendButton} ${createFieldsVerification() ? css.active : ''} `}
        disabled={!createFieldsVerification()}
        onClick={createPost}
      >
        Publicar Post
      </button>
    </div>
  )
  return(
    <>
    {createPostDisplay()}
    </>
  );
}

export default newPost;