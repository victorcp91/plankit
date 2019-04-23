import React from 'react';

import css from './Search.module.scss';
import searchIcon from '../assets/icons/searchIcon.svg';

const search = props => (
  <div className={css.container}>
    <div className={css.searchInputContainer}>
      <img className={css.searchIcon} src={searchIcon} alt="search icon"/>
      <input className={css.searchInput} placeholder="Buscar planta" type="text"/>
    </div>
    <select className={css.selectInput} name="ordenar" id="order">
      <option value="" selected>Ordenar</option>
      <option value="price">Maior Preço</option>
      <option value="price">Menor Preço</option>
      <option value="price">Recente</option>
    </select>
  </div>
);

export default search;