import React from 'react';
import { Link } from 'react-router-dom';

import { deleteUser } from '../store/user';


import Api from '../libs/Api';

import css from './ChannelHeader.module.scss';


const channelHeader = props => {

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
      </div>
    </div>
  )
};

export default channelHeader;