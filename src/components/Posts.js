import React from 'react';
import moment from 'moment';

import css from './Posts.module.scss';


const posts = React.memo(props => {

  return(
    <div className={css.postsContainer}>
      {props.posts.map(post => 
        (<div className={css.postCard}>
          <img className={css.image} src={post.image}/>
          <div className={css.info}>
            <h2 className={css.title} key={post.id}>{post.title}</h2>
            <p className={css.created}>{moment(post.createdAt).format('DD/MM/YY')}</p>
          </div>
          
        </div>))
      }
      {props.posts.map(post => 
        (<div className={css.postCard}>
          <div className={css.image} style={{backgroundImage: 'url(' + post.image + ')'}}/>
          <div className={css.info}>
            <h2 className={css.title} key={post.id}>{post.title}</h2>
            <p className={css.created}>{moment(post.createdAt).format('DD/MM/YY')}</p>
          </div>
        </div>))
      }
      {props.posts.map(post => 
        (<div className={css.postCard}>
          <div className={css.image} style={{backgroundImage: 'url(' + post.image + ')'}}/>
          <div className={css.info}>
            <h2 className={css.title} key={post.id}>{post.title}</h2>
            <p className={css.created}>{moment(post.createdAt).format('DD/MM/YY')}</p>
          </div>
        </div>))
      }
      {props.posts.map(post => 
        (<div className={css.postCard}>
          <div className={css.image} style={{backgroundImage: 'url(' + post.image + ')'}}/>
          <div className={css.info}>
            <h2 className={css.title} key={post.id}>{post.title}</h2>
            <p className={css.created}>{moment(post.createdAt).format('DD/MM/YY')}</p>
          </div>
        </div>))
      }
    </div>
  );
});

export default posts;