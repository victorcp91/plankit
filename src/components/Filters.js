import React, { useState, useRef, useEffect } from 'react';

import css from './Filters.module.scss';
import sunIcon from '../assets/icons/sunIcon.svg';
import wateringCanIcon from '../assets/icons/wateringCanIcon.svg';
import shovelIcon from '../assets/icons/shovelIcon.svg';
import treeIcon from '../assets/icons/treeIcon.svg';
import carrotIcon from '../assets/icons/carrotIcon.svg';
import orangeIcon from '../assets/icons/orangeIcon.svg';
import flowerIcon from '../assets/icons/flowerIcon.svg';
import wheatIcon from '../assets/icons/wheatIcon.svg';
import warningIcon from '../assets/icons/warningIcon.svg';

import filtersList from '../libs/filters.json';

const filters = props => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [leftArrow, setLeftArrow] = useState(false);
  const [rightArrow, setRightArrow] = useState(true);

  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSelectedSession(null);
    }
  };

  const handleFiltersScroll = event => {
    if(event.currentTarget.scrollLeft > 0){
      setLeftArrow(true);
    } else {
      setLeftArrow(false);
    }
    if(event.currentTarget.scrollLeft + event.currentTarget.offsetWidth < event.currentTarget.scrollWidth){
      setRightArrow(true);
    } else {
      setRightArrow(false);
    }
  };

  const selectSession = value => {
    setSelectedSession(value);
  };

  const getFilterIcon = (icon) => {
    switch(icon){
      case 'sunIcon':
        return sunIcon;
      case 'wateringCanIcon':
        return wateringCanIcon;
      case 'shovelIcon':
        return shovelIcon;
      case 'treeIcon':
        return treeIcon;
      case 'carrotIcon':
        return carrotIcon;
      case 'orangeIcon':
        return orangeIcon;
      case 'flowerIcon':
        return flowerIcon;
      case 'wheatIcon':
        return wheatIcon;
      case 'warningIcon':
        return warningIcon;
      default:
        return warningIcon;
    }
  }

  const generateFilters = () => {
    const session = filtersList.filter(filter => filter.title === selectedSession)[0]
    if(session) {
      switch (session.options_type){
        case 'choose':
          return session.options.map(option => (
            <div key={option.title} className={css.checkItem}>
              <input
                type="radio"
                id={session.title}
                name={session.title}
                value={session.title}
                className={css.radioInput}
              />
              <label htmlFor={session.title} className={css.radioStyle}/>
              <label
                htmlFor={session.title}
                className={`${css.inputText}
                ${option.title === '_show' ? css.show : ''}
                ${option.title === '_hide' ? css.hide: ''}`}
                >{option.text}</label>
            </div>
          ));
        case 'check':
          return session.options.map(option => (
            <div key={option.title} className={css.checkItem}>
              <input
                type="checkbox"
                id={session.title}
                name={session.title}
                value={session.title}
                className={css.checkInput}
              />
              <label htmlFor={session.title} className={css.inputStyle}/>
              <label
                htmlFor={session.title}
                className={`${css.inputText}
                ${option.title === '_show' ? css.show : ''}
                ${option.title === '_hide' ? css.hide : ''}`}
                >{option.text}</label>
            </div>
          ));
        default:
          return null;
      }
    }
  };

  return (
    <div className={css.container} ref={wrapperRef}>
      <div
        className={css.filtersSelectors}
        onScroll={handleFiltersScroll}>
        {leftArrow && <span className={css.previous} />}
        {filtersList.map((filter,index) => (
          <button
            key={filter.title}
            className={`${css.selector}
              ${selectedSession === filter.title ? css.selected : ''}
              ${filtersList.length -1 === index ?  css.last : ''}`}
            onClick={() => selectSession(filter.title)}
            >
            <span className={css.iconContainer}>
              <img className={css.icon} src={getFilterIcon(filter.icon)} alt={filter.title}/>
            </span>
            <span className={css.filterLabel}>{filter.label}</span>
          </button>
        ))}
        {rightArrow && <span className={css.next} />}
      </div>
      <div className={`${css.iconFields} ${selectedSession ? css.active : ''}`}>
        {generateFilters()}
      </div>
    </div>
  )
};

export default filters;