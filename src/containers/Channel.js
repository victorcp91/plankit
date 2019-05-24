import React, { useState, useEffect } from 'react';
import firebase from "firebase/app";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Api from '../libs/Api';

import css from './Channel.module.scss';
import PresentationArea from '../components/PresentationArea';
import Posts from '../components/Posts';
import { setChannels, setChannelPosts } from '../store/channels';

const channel = props => {

  const [loading, setLoading] = useState(true);
  const [channelSlug, setChannelSlug] = useState('');
  const [channelNotFound, setChannelNotFound] = useState(false);

  useEffect(() => {
    // setLoading(true);
    const { channel, post } = props.match.params;
    setChannelSlug(channel);
    
    Api.getChannel(channel).then(res => {
      if(res.length){
        setChannels(res);
        Api.getChannelPosts(res[0].id).then(posts => {
          setChannelPosts(res[0].id, posts);
          setLoading(false);
        })
      } else{
        setChannelNotFound(true);
        setLoading(false);
      }
    })
   
    // props.history.push(`/`);
    
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Api.getUserData(user.uid).then(userData => {
          // setUser({ ...userData });
        })
      }
    });
  }, []);

  const currentChannel = () => {
    const channel = props.channels.filter(c => c.slug === channelSlug);
    if(channel && channel.length){
      return channel[0];
    } return false;
  }

  const getLastPost = () => {
    const channel = props.channels.filter(c => c.slug === channelSlug);
    if(channel && channel.length && channel[0].posts && channel[0].posts.length){
      return channel[0].posts[0];
    } return false;
  }

  const getPosts = () => {
    const channel = props.channels.filter(c => c.slug === channelSlug);
    if(channel && channel.length && channel[0].posts && channel[0].posts.length){
      const firstPost = channel[0].posts[0];
      const posts = channel[0].posts.filter(post => post.id !== firstPost.id);
      return posts;
    } return false;
  }

  if(loading) {
    return (
      <div className={css.channelContainer}>
        <h1>CARREGANDO...</h1>
      </div>
    );
  }

  return(
    currentChannel() ?
    <div className={css.channelContainer}>
      <img className={css.cover} src={currentChannel().coverImage }/>
      <img className={css.profile} src={currentChannel().profileImage}/>
      <div className={css.info}>
        <h1 className={css.name}>{currentChannel().name}</h1>
        <p className={css.description}>{currentChannel().description}</p>
      </div>
      <PresentationArea text={currentChannel().about} />
      {getLastPost() ? 
        <div className={css.lastPost}>
          <img src={getLastPost().image} className={css.thumb}/>
          <div className={css.lastPostInfo}>
            <h2 className={css.title}>{getLastPost().title}</h2>
            <p className={css.description}>{getLastPost().description} </p>
            <label className={css.date}>{moment(getLastPost().publishedAt).format('DD/MM/YY')}</label>
          </div>
        </div>
      : null}
      {getPosts() ? 
        <Posts posts={[getLastPost()]}/>
      :null}
    </div> : 
    <div className={css.channelContainer}>
        <h1>CANAL NAO ENCONTRADO</h1>
    </div>
  )
};
const mapStateToProps = ({ plants, channels, user }) => ({ plants, channels, user });

export default connect(mapStateToProps)(channel);