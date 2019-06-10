import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

import css from './Channels.module.scss';


const channels = React.memo(props => {

  const unfollow = (e) => {
    e.preventDefault();
    props.unfollow(e.target.value);
  }

  return(
    <div className={`${props.unfollow ? css.followedChannels : css.channels}`}>
      {props.channels.length ? 
        props.channels.map(channel => (
          <Link className={css.channel} key={channel.id} to={`/${channel.slug}`}>
            {props.unfollow ? <button className={css.delete} value={channel.id} onClick={unfollow}/>: null}
            <img
              className={css.profileImage}
              src={channel.profileImage}
              alt={channel.name}/>
            <div className={css.info}>
              <h2 className={css.name}>{channel.name}</h2>
              <p className={css.description}>{channel.description}</p>
            </div>
          </Link>
        )): 'Você ainda não está seguindo nenhum canal =('}
    </div>
  );
});

export default channels;