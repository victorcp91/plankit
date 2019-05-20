import React, { useState, useEffect } from 'react';
import Api from '../libs/Api';
import { setUser } from '../store/user';
import css from './MyChannel.module.scss';
import moment from 'moment';

import { comparableString } from '../libs/Utils';

import DropZone from './DropZone';

const myChannel = props => {

  const [newOtherChannel, setNewOtherChannel] = useState('');
  const [otherChannels, setOtherChannels] = useState([]);
  const [myInfo, setMyInfo] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [channelTags, setChannelTags] = useState([]);
  const [channelAbout, setChannelAbout] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if(props.channel){
      setChannelName(props.channel.name);
      setChannelDescription(props.channel.description);
      setChannelTags(props.channel.tags);
      setChannelAbout(props.channel.about);
    }
  }, []);

  const handleInput = e => {
    const target = e.currentTarget;
    e.persist();
    switch(target.name) {
      case 'otherChannel':
        setNewOtherChannel(target.value);
        break;
      case 'myInfo':
        setMyInfo(target.value);
        break;
      case 'newTag':
        setNewTag(target.value);
        break;
      case 'channelName':
        setChannelName(target.value);
        break;
      case 'channelDescription':
        setChannelDescription(target.value);
        break;
      case 'channelAbout':
        setChannelAbout(target.value);
        break;
      default: 
        break;
    }
  }

  const handleChannelKeyDown = e => {
    if(e.key === 'Enter'){
      addOtherChannel();
    }
  }

  const handleTagKeyDown = e => {
    if(e.key === 'Enter'){
      addNewTag();
    }
  }

  const addOtherChannel = () => {
    const channels = otherChannels;
    channels.push(newOtherChannel);
    setOtherChannels(channels);
    setNewOtherChannel('');
  }

  const deleteOtherChannel = e => {
    let channels = otherChannels;
    channels = channels.filter(channel=> channel !== e.currentTarget.value);
    setOtherChannels(channels);
  }

  const addNewTag = () => {
    let newTags = channelTags;
    let comparableTags= [];
    newTags.forEach(tag=> {
      comparableTags.push(comparableString(tag));
    })

    if(!comparableTags.includes(comparableString(newTag))) {
      newTags.push(newTag);
      setChannelTags(newTags);
    }
    setNewTag('');
  }

  const deleteChannelTag = e => {
    let newTags = channelTags;
    newTags = newTags.filter(tag => tag !== e.currentTarget.value);
    setChannelTags(newTags);
  }

  const requestFieldsVerification = () => {
    if(otherChannels.length || myInfo.length > 50) {
        return true;
      }
    return false;
  }

  const createFieldsVerification = () => {
    if(channelName && channelName.length > 3 && 
      channelDescription && channelDescription.length > 5 &&
      channelAbout.length > 5 &&
      (coverImageFile || (props.channel && props.channel.coverImage)) &&
      (profileImageFile || (props.channel && props.channel.profileImage))) {
        return true;
      }
    return false;
  }

  const requestChannel = () => {
    Api.requestChannel({
      otherChannels,
      myInfo,
      uid: props.user.uid,
    }).then(() => {
      Api.getUserData(props.user.uid).then(userData => {
        setUser({ ...userData });
      });
    });
  }

  const createChannel = () => {
    Api.createChannel({
      adminUsers: [],
      createdAt: moment().format(),
      updatedAt: '',
      name: channelName,
      owner: props.user.uid,
      tags: channelTags,
      posts: [],
      subscribers: [],
      coverImage: coverImageFile,
      profileImage: profileImageFile,
      about: channelAbout,
      description: channelDescription
    }).then(res => {
      console.log('criado');
    });
  }

  const updateChannel = () => {

    let newChannelInfo = {
      updatedAt: moment().format(),
      tags: channelTags,
      name: channelName,
      about: channelAbout,
      description: channelDescription
    }

    if(coverImageFile){
      newChannelInfo = {
        ...newChannelInfo,
        coverImage: coverImageFile,
      }
    }

    if(profileImageFile){
      newChannelInfo = {
        ...newChannelInfo,
        profileImage: profileImageFile,
      }
    }

    Api.updateChannel(props.channel.id, newChannelInfo).then(res => {
      console.log('atualizado');
    });
  }

  const deleteCoverImageFile = () => {
    setCoverImageFile(null);
  }

  const deleteProfileImageFile = () => {
    setProfileImageFile(null);
  }

  const requestChannelForm = () => (
    <div className={css.requestChannelContainer}>
      <p className={css.disclaimerMessage}>Poxa! Você ainda não possui um canal ativo =(</p>

      <p className={css.createChannelCTA}>Gostaria de ser um de nossos produtores de conteúdo? Conte-nos um pouco mais!</p>

      <label>Possui algum conteúdo publicado em outros canais? (Facebook, Youtube, Blogs, Páginas, etc..)<br/>Adicione os links!</label>
        <span className={css.fieldContainer}>
          <input
            className={css.field}
            type="text"
            name="otherChannel"
            placeholder="Ex: www.meuconteudo.com"
            value={newOtherChannel}
            onChange={handleInput} 
            onKeyDown={handleChannelKeyDown}
          />
          <button onClick={addOtherChannel} name="channel" className={css.addIcon}/>
        </span>
        <div className={css.otherChannelsContainer}>
          {otherChannels.map(channel => (
            <span
              key={channel}
              className={css.otherChannel}
            >
              <a href={channel.includes('http') || channel.includes('https') ? channel : `https://${channel}` } target="_blank">
                {channel}
              </a>
              
              <button className={css.delete} value={channel} onClick={deleteOtherChannel}/>
            </span>
          ))}
        </div>
        
        <textarea
          className={`${css.myInfo}`}
          placeholder="Conte mais sobre como suas principais aptidões irão contribuir para nossa comunidade..."
          value={myInfo}
          name="myInfo"
          onChange={handleInput}
        />
        { myInfo.length && !requestFieldsVerification() ? <label className={css.warning}>Ainda não é o suficiente...</label> : null}

      <button
        className={`${css.sendButton} ${requestFieldsVerification() ? css.active : ''} `}
        disabled={!requestFieldsVerification()}
        onClick={requestChannel}
      >
        Solicitar Canal
      </button>
 
    </div>
  )
  
  const waitingDisplay = () => (
    <div className={css.requestChannelContainer}>
      <p className={css.disclaimerMessage}>Ainda não conseguimos avaliar o seu pedido.</p> 
      <p className={css.createChannelCTA}>Avisaremos assim que tiver uma resposta. =)</p>
    </div>
  )

  const createChannelDisplay = () => (
    <div className={css.requestChannelContainer}>
      <div className={css.mainInfoContainer}>
        <DropZone
          imageFile={profileImageFile}
          imageUrl={props.channel ? props.channel.profileImage: ''}
          selectedImage={setProfileImageFile} 
          delete={deleteProfileImageFile}
          type="profile"/>
        <div className={css.fieldContainer}>
          <input
            className={css.field}
            placeholder="Nome do canal*"
            type="text"
            name="channelName"
            value={channelName}
            onChange={handleInput} 
          />
          <input
            className={css.field}
            placeholder="Descrição do canal*"
            type="text"
            name="channelDescription"
            value={channelDescription}
            onChange={handleInput} 
          />
          <label className={css.keywordsLabel}>Adicione até 5 termos para que os usuários possam encontrar o seu canal:</label>
          <span className={css.fieldContainer}>
            <input
              className={css.field}
              type="text"
              name="newTag"
              placeholder={channelTags.length > 4 ? 'Limite máximo atingido': ''}
              value={newTag}
              onChange={handleInput} 
              onKeyDown={handleTagKeyDown}
              disabled={channelTags.length > 4}
            />
            {channelTags.length < 5 ? <button className={css.addIcon} onClick={addNewTag}/> : null}
          </span>
          <div className={css.channelTagsContainer}>
            {channelTags.map(tag => (
              <span
                key={tag}
                className={css.tag}
              >
                {tag}
                <button className={css.delete} value={tag} onClick={deleteChannelTag}/>
              </span>
            ))}
          </div>
        </div>
      </div>
      <DropZone
        imageFile={coverImageFile}
        imageUrl={props.channel ? props.channel.coverImage: ''}
        selectedImage={setCoverImageFile}
        delete={deleteCoverImageFile}
        type="cover"/>
      <textarea
        className={css.aboutTextField}
        placeholder="Sobre o canal..."
        value={channelAbout}
        name="channelAbout"
        onChange={handleInput}
      />
      <button
        className={`${css.sendButton} ${createFieldsVerification() ? css.active : ''} `}
        disabled={!createFieldsVerification()}
        onClick={props.channel ? updateChannel : createChannel}
      >
        {props.channel? 'Salvar alterações' : 'Criar Canal'}
      </button>
    </div>
  )
  

  return(
    <>
    {props.user && !props.user.channelOwnerPermission && requestChannelForm() }
    {props.user && props.user.channelOwnerPermission && props.user.channelOwnerPermission === 'waiting' && waitingDisplay()}
    {props.user && props.user.channelOwnerPermission && props.user.channelOwnerPermission === 'approved' && createChannelDisplay()}
    </>
  );
}

export default myChannel;