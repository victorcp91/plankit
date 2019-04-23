import React, { useState } from 'react';

import css from './Plants.module.scss';
import houseIcon from '../assets/icons/houseIcon.svg';
import pinIcon from '../assets/icons/pinIcon.svg';
import clipboardIcon from '../assets/icons/clipboardIcon.svg';
import PlantInfo from './PlantInfo';


const plants = props => {

  const [selectedPlant, setSelectedPlant] = useState(null);

  const selectPlant = (plantId) => {
    setSelectedPlant(plantId);
    document.body.style.overflow = "hidden";
  }
  const getSelectedPlant = () => {
    return props.plants.find(plant => plant.id === selectedPlant);
  }
  const closeModal = () => {
    setSelectedPlant(null);
    document.body.style.overflow = "scroll";
  }

  return(
    props.plants.length ? 
    <>
    <div className={css.plantsContainer}>
      {selectedPlant && getSelectedPlant() ?
        <>
        <span className={css.overlay}/>
        <PlantInfo
          plant={getSelectedPlant()}
          close={closeModal}/>
        </>: null }
      {props.plants.map(plant => (
        <div key={plant['popular_name_pt-br']} className={css.plantCard}>
          <div className={css.imageContainer} style={{backgroundImage: `url(${plant.image})`}}>

          </div>
          <div className={css.infoContainer}>
            <h3 className={css.plantTitle}>{plant['popular_name_pt-br']}</h3>
            <div className={css.plantPrice}>
              R$ <span className={css.green}>{plant.price.maximum_real}</span>
            </div>
          </div>
          <div className={css.actionsContainer}>
            <div className={css.labelArea}>
              <button 
                className={`${css.actionButton} ${css.garden}`}
              >
                <img className={css.icon} src={houseIcon} alt="Meu Jardim"/>
              </button>
              <label className={css.label}>
                Adicionar ao<br/>Meu Jardim
              </label>
            </div>

            <div className={css.labelArea}>
              <button className={`${css.actionButton} ${css.location}`}>
                <img className={css.icon} src={pinIcon} alt="Onde encontrar"/>
              </button>
              <label className={css.label}>
              Onde<br/>Encontrar
              </label>
            </div>
            <div className={css.labelArea}>
              <button
                className={`${css.actionButton} ${css.info}`}
                onClick={() => selectPlant(plant.id)}>
                <img className={css.icon} src={clipboardIcon} alt="Informações"/>
              </button>
              <label className={css.label}>
                  Informações
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
    </>: <h1>LOADING</h1>
  );
}

export default plants;