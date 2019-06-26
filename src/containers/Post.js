import React, { useState, useEffect } from 'react';
import firebase from "firebase/app";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { convertToRaw, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import Api from '../libs/Api';

import css from './Post.module.scss';
import PresentationArea from '../components/PresentationArea';
import ChannelHeader from '../components/ChannelHeader';
import Plants from '../components/Plants';
import Posts from '../components/Posts';
import LoginModal from '../components/LoginModal';
import { setChannels, setChannelPosts } from '../store/channels';
import { deleteUser, setUser, addFollowedChannel, removeFollowedChannel } from '../store/user';
import { setPlants }  from  '../store/plants';
import { createSecureContext } from 'tls';
import spinner from '../assets/icons/loading.svg';


const post = props => {
  const { channel, post } = props.match.params;

  const [loading, setLoading] = useState(true);
  const [channelSlug, setChannelSlug] = useState(channel);
  const [postSlug, setPostSlug] = useState(post);
  const [channelNotFound, setChannelNotFound] = useState(false);
  const [loginModalActive, setLoginModalActive] = useState(false);
  const [loginDisclaimer, setLoginDisclaimer] = useState('');

  useEffect(() => {
    // setLoading(true); 
    Api.getChannel(channel).then(res => {
      if(res.length){
        setChannels(res);
        Api.getChannelPosts(res[0].id).then(posts => {
          setChannelPosts(res[0].id, posts);
          setLoading(false);
          let post = posts.filter(p => p.slug === postSlug);
          if(post && post.length && post[0].plants.length){
            post[0].plants.forEach(plant => {
              Api.getPlant(plant).then(res => {
                setPlants([res]);
              })
            });
          }
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
          setUser({ ...userData });
        })
      }
    });
  }, []);

  useEffect(() => {
    console.log('aqui',props.match.params.post );
    // setLoading(true); 
    if(props.match.params.post){
      setPostSlug(props.match.params.post);
    }
    
  }, [props.match.params]);


  const currentChannel = () => {
    const channel = props.channels.filter(c => c.slug === channelSlug);
    if(channel && channel.length){
      return channel[0];
    } return false;
  }

  const currentPost = () => {
    if(currentChannel().posts){
      const post = currentChannel().posts.filter(c => c.slug === postSlug);
      if(post && post.length){
        return post[0];
      }
    } return false;
  }

  const morePosts = () => {
    if(currentChannel().posts){
      const posts = currentChannel().posts.filter(c => c.slug !== postSlug);
      if(posts && posts.length){
        posts.sort((a,b) => moment(b.publishedAt) - moment(a.publishedAt))
        return posts.slice(0,3);
      }
    } return [];
  }

  const convertCommentFromJSONToHTML = (text) => { 
    return draftToHtml(convertFromRaw(text));
  }

  const createMarkup = () => {
    return {__html: draftToHtml(currentPost().content)}
  }; 

  const getPostPlants = () => {
    if(currentPost()){
      const plants = props.plants.filter(plant => currentPost().plants.includes(plant.id));
      return plants;
    } return false;
    
  }

  const follow = () => {
    if(props.user && props.user.followedChannels){
      let followedChannels = props.user.followedChannels.find(c => c.id === currentChannel().id);
      if(!followedChannels){
        addFollowedChannel(props.user, currentChannel());
        Api.followChannel(props.user, currentChannel()).then(() => {
          Api.getUserData(props.user.uid).then(userData => {
            setUser({ ...userData });
          });
          Api.updateChannelFollowers(currentChannel(), props.user.uid).then(() => {
            Api.getChannel(currentChannel().slug).then(res => {
              if(res.length){
                setChannels(res);
              }
            });
          })
        });
      }else {
        removeFollowedChannel(props.user, currentChannel().id);
        Api.unfollowChannel(props.user, currentChannel().id).then(() => {
          Api.getUserData(props.user.uid).then(userData => {
            setUser({ ...userData });
          });
          Api.updateChannelFollowers(currentChannel(), props.user.uid).then(() => {
            Api.getChannel(currentChannel().slug).then(res => {
              if(res.length){
                setChannels(res);
              }
            });
          })
        });
      }
    }else {
      setLoginDisclaimer('Faça login para poder seguir este canal. É bem simples e rápido.')
      setLoginModalActive(true);
    }
  }

  const toogleLoginModal = () => {
    setLoginModalActive(!loginModalActive);
  }

  if(loading) {
    return (
      <div className={css.channelContainer}>
        <img class={css.loading} src={spinner}/>
      </div>
    );
  }

  return(
    currentChannel() ?
    <div className={css.postContainer}>
      {loginModalActive &&
      <>
        <span className={css.loginContainerOverlay} />
        <LoginModal
          close={toogleLoginModal}
          disclaimer={loginDisclaimer}/>
      </>}
      <ChannelHeader channel={currentChannel()} user={props.user} follow={follow}  />  
      <h1 className={css.title}>{currentPost().title}</h1>
      {currentPost().youtubeId ?
        <div className={css.videoContainer}>
          <iframe src={`//www.youtube.com/embed/${currentPost().youtubeId}`}
            frameBorder='0'
            allow='autoplay; encrypted-media'
            allowFullScreen
            title='video'
          /> 
        </div>
        : <img className={css.image} src={currentPost().image} />}
      {currentPost().content &&
      <div className={css.content} dangerouslySetInnerHTML={createMarkup()} />}
      {getPostPlants().length ? <Plants plants={getPostPlants()} user={props.user}/> : null}
      <label className={css.morePosts}>Outras postagens:</label>
      <Posts posts={morePosts()} channelSlug={currentChannel().slug}/>
    </div> : 
    <div className={css.channelContainer}>
        <h1>POST NAO ENCONTRADO</h1>
    </div>
  )
};
const mapStateToProps = ({ plants, channels, user }) => ({ plants, channels, user });

export default connect(mapStateToProps)(post);