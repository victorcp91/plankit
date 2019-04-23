import React from 'react';

import css from './PresentationArea.module.scss';

const presentationArea = props => (
  <>
    <p className={css.presentationText}>Etiam luctus tincidunt justo in aliquam. Nulla quam diam, auctor et turpis nec, bibendum vehicula velit. Nulla sollicitudin ornare justo, a blandit est vehicula a. Integer imperdiet tortor eget congue consequat. Provitae justo auctor fermentum aliquet a sem.</p>
    <hr className={css.divisor}/>
  </>
);

export default presentationArea;