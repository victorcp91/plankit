import React from 'react';
import { Link } from 'react-router-dom';

import { deleteUser } from '../store/user';
import Api from '../libs/Api';

import houseIcon from '../assets/icons/houseIcon.svg';
import css from './ChannelHeader.module.scss';


const channelHeader = props => {

  const isFollowing = () => {
    if(props.user && props.user.followedChannels){
      const followedChannel = props.user.followedChannels.find(c => c.id === props.channel.id);
      if(followedChannel){
        return true;
      }
    } return false;
  }

  return (
    <div className={css.channelHeader}>
      <img className={`${css.cover} ${props.post ? css.post : ''}`} src={props.channel.coverImage }/>
      <Link to={`/${props.channel.slug}`}>
        <img className={css.profile} src={props.channel.profileImage}/>
      </Link>
      <div className={css.info}>
        <Link className={css.link} to={`/${props.channel.slug}`}>
          <h1 className={css.name}>{props.channel.name}</h1>
        </Link>
        <p className={css.description}>{props.channel.description}</p>
        <div className={`${css.followArea} ${isFollowing() && css.active}`}>
          <button id="follow" onClick={props.follow} className={css.follow}>
            <img className={css.icon} src={houseIcon} alt="Meu Jardim"/>
          </button>
          <label htmlFor="follow">{isFollowing() ? 'Seguindo' : 'Seguir'}</label>
        </div>
      </div>
    </div>
  )
};

export default channelHeader;