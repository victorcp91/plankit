import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Api from '../libs/Api';
import css from './MyPosts.module.scss';
import moment from 'moment';

import DropZone from './DropZone';

const myPosts = props => {

  const [postImageFile, setPostImageFile] = useState(null);
  const [postImageURL, setPostImageURL] = useState('');
  const [youtubeEmbeddedURL, setYoutubeEmbeddedURL] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [youtubeId, setYoutubeId] = useState(null);

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
    // Api.createChannel({
    //   adminUsers: [],
    //   createdAt: moment().format(),
    //   updatedAt: '',
    //   name: channelName,
    //   owner: props.user.uid,
    //   tags: channelTags,
    //   posts: [],
    //   subscribers: [],
    //   coverImage: coverImageFile,
    //   profileImage: profileImageFile,
    //   about: channelAbout,
    //   description: channelDescription
    // }).then(res => {
    //   console.log('criado');
    // });
  }

  const deletePostImageFile = () => {
    setPostImageFile(null);
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
        imageUrl={postImageURL ? postImageURL : ''}
        selectedImage={setPostImageFile}
        delete={deletePostImageFile}
        type="post"
        placeholder={postImageURL}
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

export default myPosts;