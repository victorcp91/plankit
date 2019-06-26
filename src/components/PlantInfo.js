import React, { useState, useEffect, useRef } from 'react';

import css from './PlantInfo.module.scss';
import houseIcon from '../assets/icons/houseIcon.svg';
import pinIcon from '../assets/icons/pinIcon.svg';

import filters from '../libs/filters.json';

const plantInfo = props => {

  const [opened, setOpened] = useState(false);  
  const wrapperRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setOpened(true);
      document.addEventListener("click", handleClickOutside, false);
    }, 1)
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    }
  }, []);


  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      props.close();
    }
  };


  const getFiltersInfo = () => {
    let info = [];
    filters.forEach(filter => {
      if(filter.options_type === "choose" && plant.tags.indexOf(filter.title) > -1){
        info.push(
          <span key={filter.title} className={css.filterItem}>
            <span className={css.filterLabel}>{filter.label}</span>
          </span>
        )
      }else if(filter.options_type === "check"){
        const label = <span className={css.filterLabel}>{filter.label}: </span>;
        const subFilters = []
        filter.options.forEach(option => {
          if(plant.tags.indexOf(option.title) > -1){
            subFilters.push(`${option.text.toLowerCase()}, `);
          }
        });
        if(subFilters.length){
          subFilters[subFilters.length -1] = subFilters[subFilters.length-1].split(', ')[0];
          info.push(<span key={filter.title} className={css.filterItem}>{label}{subFilters}</span>); 
        }
      }
    });
    return info;
  }

  const insideMyGardem = (plantId) => {
    if(props.user.gardem && props.user.gardem.length){
      return props.user.gardem.find(plant => plant.id === plantId)
    }
  }

  const close = () => {
    props.close();
  }

  

  const plant = props.plant;

  return(
    <div className={`${css.plantInfo} ${opened? css.opened : null}`} ref={wrapperRef}>
      <button
        onClick={close}
        className={css.closeButton} 
        />
      <img className={css.imageContainer} src={plant.image} />
      <div className={css.infoContainer}>
        <h3 className={css.plantTitle}>{plant.popularNamePtBr}</h3>
        {plant.otherPopularNamesPtBr.map(name => (
          <h3 key={name} className={css.plantName}>{name}</h3>
        ))}
        {/* <div className={css.plantPrice}>
          R$ <span className={css.green}>{plant.price.maximumBrl}</span>
        </div> */}
        <div className={css.actionsContainer}>
          <div className={css.buttonArea}>
            <button 
              className={`${css.actionButton}
              ${insideMyGardem(plant.id) ? css.active : ''}`}
              onClick={() => props.myGarden(plant)}
            >
              <img className={css.icon} src={houseIcon} alt="Meu Jardim"/>
            </button>
            <label className={css.label}>
              Adicionar ao<br/>Meu Jardim
            </label>
          </div>

          {/* <div className={css.buttonArea}>
            <button className={`${css.actionButton} ${css.location}`}>
              <img className={css.icon} src={pinIcon} alt="Onde encontrar"/>
            </button>
            <label className={css.label}>
            Onde<br/>Encontrar
            </label>
          </div> */}
        </div>
      </div>
      <div className={css.info}>
        <div className={css.filterInfo}>
          {plant.scientificName ?
            <span className={css.filterItem}>
              <span className={css.filterLabel}>Nome Científico: </span>{plant.scientificName}
            </span>: null}
          {getFiltersInfo()}  
        </div>
        <div className={css.moreInfo}>
          {plant.about && plant.about[0].aboutPtBr ? plant.about[0].aboutPtBr : ''}
        </div>
      </div>
    </div>
  );
}

export default plantInfo;