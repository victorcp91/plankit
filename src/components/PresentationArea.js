import React from 'react';

import css from './PresentationArea.module.scss';

const presentationArea = props => (
  <>
    <p className={css.presentationText}>{props.text}</p>
    <hr className={css.divisor}/>
  </>
);

export default presentationArea;