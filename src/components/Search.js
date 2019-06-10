import React, { useState, useEffect } from 'react';

import css from './Search.module.scss';
import searchIcon from '../assets/icons/searchIcon.svg';

const search = props => {
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let searchTermTimer = setTimeout(()=> {
      props.searchTerm(searchTerm.toLocaleLowerCase());
    },1500);
    return () => {
      clearTimeout(searchTerm)
    };
  }, [searchTerm]);
  

  const handleSearchTerm = e => {
    setSearchTerm(e.currentTarget.value);
  }

  const handleSort = e => {
    
  }


  return(
  <div className={`${css.container} ${props.hideSort && css.onlySearch}`}>
    <div className={css.searchInputContainer}>
      <img className={css.searchIcon} src={searchIcon} alt="search icon"/>
      <input
        className={css.searchInput}
        placeholder={props.placeholder}
        type="text"
        value={searchTerm}
        onChange={handleSearchTerm} 
        />
    </div>
    {props.hideSort ? null :
    <select
      className={css.selectInput}
      name="ordenar"
      id="sort"
      onChange={handleSort} 
      defaultValue=""
      >
      <option value="">Ordenar</option>
      <option value="ascending">Ordem Alfabética Crescente</option>
      <option value="descending">Ordem Alfabética Decrescente</option>
      <option value="byDate">Mais Recente</option>
    </select>}
  </div>
  );
  }

export default search;