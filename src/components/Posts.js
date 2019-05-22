import React from 'react';

import css from './Posts.module.scss';


const posts = React.memo(props => {

  return(
    <>
      <h1>POSTS</h1>
      {props.posts.map(post => <h2 key={post.id}>{post.title}</h2>)}
    </>
  );
});

export default posts;