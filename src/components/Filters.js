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
  const [selectedSection, setSelectedSection] = useState(null);
  const [leftArrow, setLeftArrow] = useState(false);
  const [rightArrow, setRightArrow] = useState(true);

  const [filters, setFilters] = useState({
    direct_light: false,
    half_shadow: false,
    indirect_light: false,
    shadow: false,
    marshy_ground: false,
    moist_ground: false,
    dry_ground: false,
    sprinkler_watering: false,
    ground_planting: false,
    aerial_plant: false,
    water_plant: false,
    small_size: false,
    midsize: false,
    large: false,
    tree: false,
    vegetable_leaves: false,
    vegetable: false,
    herbs: false,
    pancs: false,
    hide_vegetable_garden: false,
    show_fruitiful: true,
    only_fruitful: false,
    hide_fruitful: false,
    show_floriferous: true,
    only_floriferous: false,
    hide_floriferous: false,
    show_bindweed: true,
    only_bindweed: false,
    hide_bindweed: false,
    thorns: false,
    poisonous: false,
    hide_dangerous: false
  });

  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  useEffect(() => {
    let filterTimer = setTimeout(()=> {
      props.setFilters(getActiveFilters());
    },1500);
    return () => {
      clearTimeout(filterTimer)
    };
  }, [filters]);
  
  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSelectedSection(null);
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

  const selectSection = value => {
    setSelectedSection(value);
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

  const changeFilter = e => {
    const target = e.currentTarget;
    e.persist();

    const currentValue = filters[target.name];
    if(target.name === 'hide_vegetable_garden' && !currentValue){
      setFilters(filters => ({...filters,
        vegetable_leaves: false,
        vegetable: false,
        herbs: false,
        pancs: false,
        hide_vegetable_garden: !currentValue
      }));
    } else if(target.name === 'vegetable_leaves' ||
    target.name === 'vegetable' ||
    target.name === 'herbs' ||
    target.name === 'pancs'){
      setFilters(filters => ({...filters,
        hide_vegetable_garden: false,
        [target.name]: !currentValue
      }));
    } else if(target.name === 'hide_dangerous' && !currentValue){
      setFilters(filters => ({...filters,
        thorns: false,
        poisonous: false,
        hide_dangerous: !currentValue
      }));
    } else if(target.name === 'thorns' || target.name === 'poisonous'){
      setFilters(filters => ({...filters,
        hide_dangerous: false,
        [target.name]: !currentValue
      }));
    } else if(target.name === 'fruitful' ||
      target.name === 'floriferous' ||
      target.name === 'bindweed') {
        if(target.value.includes('show')) {
          setFilters(filters => ({...filters,
            [`hide_${target.name}`]: false,
            [`only_${target.name}`]: false,
            [`show_${target.name}`]: true
          }));
        } else if(target.value.includes('only')) {
          setFilters(filters => ({...filters,
            [`hide_${target.name}`]: false,
            [`show_${target.name}`]: false,
            [`only_${target.name}`]: true
          }));
        } else if(target.value.includes('hide')){
          setFilters(filters => ({...filters,
            [`only_${target.name}`]: false,
            [`show_${target.name}`]: false,
            [`hide_${target.name}`]: true
          }));
        }
    } else{
      setFilters(filters => ({...filters, [target.name]: !currentValue} ));
    }
  }

  const filterSectionActive = section => {
    const options = filtersList.filter(f => f.title === section)[0].options;
    if(options){
      const filters = getActiveFilters();
      for (let i = 0; i < options.length; i++) {
        if (filters.includes(options[i].title)) {
          return true;
        }
      }  
    }
    return false;
  }
  const filterSectionHidden = section => {
    const options = filtersList.filter(f => f.title === section)[0].options;
    if(options){
      const filters = getActiveFilters();
      for (let i = 0; i < options.length; i++) {
        if (filters.includes(options[i].title) && options[i].title.includes('hide')) {
          return true;
        }
      }  
    }
    return false;
  }

  const getActiveFilters = () => {
    const filtersList = Object.keys(filters).filter(key => filters[key] && !key.includes('show'));
    for(let i = 0; i < filtersList.length; i++){
      if(filtersList[i].includes('only')){
        filtersList[i] = filtersList[i].split('only_')[1];
      }
    }
    return filtersList;
  }

  const generateFilters = () => {
    const section = filtersList.filter(filter => filter.title === selectedSection)[0]
    if(section) {
      switch (section.options_type){
        case 'choose':
          return section.options.map(option => (
            <div key={option.title} className={css.checkItem}>
              <input
                type="radio"
                id={option.title}
                name={section.title}
                defaultChecked={filters[option.title]}
                value={option.title}
                className={css.radioInput}
                onChange={changeFilter}
              />
              <label
                htmlFor={option.title}
                className={css.radioStyle}
              />
              <label
                htmlFor={option.title}
                className={`${css.inputText}
                ${option.title.includes('hide') ? css.hide: ''}`}
                >{option.text}</label>
            </div>
          ));
        case 'check':
          return section.options.map(option => (
            <div key={option.title} className={css.checkItem}>
              <input
                type="checkbox"
                id={option.title}
                name={option.title}
                className={css.checkInput}
                onChange={changeFilter}
                checked={filters[option.title]}
              />
               <label
                htmlFor={option.title}
                className={css.inputStyle}
                name={option.title}
                value={filters[option.title]}
              />
              <label
                htmlFor={section.title}
                className={`${css.inputText}
                ${option.title.includes('hide') ? css.hide : ''}`}
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
              ${selectedSection === filter.title ? css.selected : ''}
              ${filtersList.length -1 === index ?  css.last : ''}`}
            onClick={() => selectSection(filter.title)}
            >
            <span
              className={`${filterSectionActive(filter.title) ? css.active : ''}
              ${filterSectionHidden(filter.title) ? css.hidden : ''}`}/>
            <span className={css.iconContainer}>
              <img className={css.icon} src={getFilterIcon(filter.icon)} alt={filter.title}/>
            </span>
            <span className={css.filterLabel}>{filter.label}</span>
          </button>
        ))}
        {rightArrow && <span className={css.next} />}
      </div>
      <div className={`${css.iconFields} ${selectedSection ? css.active : ''}`}>
        {generateFilters()}
      </div>
    </div>
  )
};

export default filters;