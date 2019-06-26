import React, { useState, useEffect } from 'react';
import firebase from "firebase/app";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Api from '../libs/Api';

import css from './Channel.module.scss';
import ChannelHeader from '../components/ChannelHeader';
import PresentationArea from '../components/PresentationArea';
import Posts from '../components/Posts';
import LoginModal from '../components/LoginModal';
import { setChannels, setChannelPosts } from '../store/channels';
import { deleteUser, setUser, addFollowedChannel, removeFollowedChannel } from '../store/user';
import spinner from '../assets/icons/loading.svg';


const channel = props => {

  const [loading, setLoading] = useState(true);
  const [channelSlug, setChannelSlug] = useState(props.match.params.channel);
  const [channelNotFound, setChannelNotFound] = useState(false);
  const [loginModalActive, setLoginModalActive] = useState(false);
  const [loginDisclaimer, setLoginDisclaimer] = useState('');

  useEffect(() => {
    setLoading(false);
    const { channel, post } = props.match.params;
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
    
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Api.getUserData(user.uid).then(userData => {
          setUser({ ...userData });
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
      const posts = channel[0].posts;
      posts.sort((a,b) => moment(b.publishedAt) - moment(a.publishedAt));
      return posts[0];
    } return false;
  }

  const getPosts = () => {
    const channel = props.channels.filter(c => c.slug === channelSlug);
    if(channel && channel.length && channel[0].posts && channel[0].posts.length){
      const firstPost = channel[0].posts[0];
      const posts = channel[0].posts.filter(post => post.id !== firstPost.id);
      posts.sort((a,b) => moment(b.publishedAt) - moment(a.publishedAt))
      return posts;
    } return false;
  }

  if(loading) {
    return (
      <div className={css.channelContainer}>
        <img className={css.loading} src={spinner}/>
      </div>
    );
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

  return(
     currentChannel() ?
    <div className={css.channelContainer}>
      {loginModalActive &&
      <>
        <span className={css.loginContainerOverlay} />
        <LoginModal
          close={toogleLoginModal}
          disclaimer={loginDisclaimer}/>
      </>}
      <ChannelHeader channel={currentChannel()} user={props.user} follow={follow}  />      
      <PresentationArea text={currentChannel().about} />
      {getLastPost() ? 
        <div className={css.lastPost}>
          <Link to={`/${currentChannel().slug}/${getLastPost().slug}`}>
            <img src={getLastPost().image} className={css.thumb}/>
          </Link>
          <div className={css.lastPostInfo}>
            <Link to={`/${currentChannel().slug}/${getLastPost().slug}`}>
              <h2 className={css.title}>{getLastPost().title}</h2>
            </Link>
            <p className={css.description}>{getLastPost().description} </p>
            <label className={css.date}>{moment(getLastPost().publishedAt).format('DD/MM/YY')}</label>
          </div>
        </div>
      : null}
      {getPosts() ? 
        <Posts posts={getPosts()} channelSlug={currentChannel().slug}/>
      :null}
    </div> : 
    <div className={css.channelContainer}>
      {channelNotFound ? 
      <h1 className={css.notFound}>CANAL NÃO ENCONTRADO</h1> :
      <img className={css.loading} src={spinner}/>}

    </div>
  )
};
const mapStateToProps = ({ plants, channels, user }) => ({ plants, channels, user });

export default connect(mapStateToProps)(channel);