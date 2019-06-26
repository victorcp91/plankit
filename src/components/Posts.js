import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import css from './Posts.module.scss';


const posts = props => {
  let orderedPosts = props.posts;
  if(props.order){
    orderedPosts = orderedPosts.sort((a,b) => moment(b.createdAt).format('YYYYMMDD') - moment(a.createdAt).format('YYYYMMDD'));
  }

  return(
    <div className={css.postsContainer}>
      {orderedPosts.map(post => 
        (<Link key={`${post.slug}-${post.id}`} className={css.postLink} to={`/${post.channelSlug}/${post.slug}`}>
          <div className={css.postCard}>
            <div className={css.imageContainer}>
              <img className={css.image} src={post.image}/>
            </div>
            <div className={css.info}>
              <h2 className={css.title} key={post.id}>{post.title}</h2>
              <p className={css.description}>{post.description}</p>
              <p className={css.created}>{moment(post.createdAt).format('DD/MM/YY')}</p>
            </div>
          </div>
        </Link>
        ))
      }
    </div>
  );
};

export default posts;