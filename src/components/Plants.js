import React, { useState } from 'react';

import css from './Plants.module.scss';
import houseIcon from '../assets/icons/houseIcon.svg';
import pinIcon from '../assets/icons/pinIcon.svg';
import clipboardIcon from '../assets/icons/clipboardIcon.svg';
import PlantInfo from './PlantInfo';
import LoginModal from './LoginModal';


const plants = React.memo(props => {

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [loginModalActive, setLoginModalActive] = useState(false);
  const [loginDisclaimer, setLoginDisclaimer] = useState('');

  const selectPlant = (plantId) => {
    setSelectedPlant(plantId);
    document.body.style.overflow = "hidden";
  }

  const getSelectedPlant = () => {
    return props.plants.find(plant => plant.id === selectedPlant);
  }

  const setMyGarden = (plant) => {
    if(!props.user){
      setLoginDisclaimer('Para organizar suas plantas do seu jeitinho é necessário fazer login ; )')
      toogleLoginModal();
    } else {
      if(props.user.gardem.find(p => p.id === plant.id)){
        props.removeGardemPlant(plant);
      }else{
        props.addGardemPlant(plant);
      }
    }
  }

  const toogleLoginModal = () => {
    setLoginModalActive(!loginModalActive);
  }

  const closeInfoModal = () => {
    setSelectedPlant(null);
  }

  const insideMyGardem = (plantId) => {
    if(props.user.gardem && props.user.gardem.length){
      return props.user.gardem.find(plant => plant.id === plantId)
    }
  }


  return(
    props.plants && props.plants.length ? 
    <>
    <div className={css.plantsContainer}>
      {selectedPlant && getSelectedPlant() ?
        <>
        <span className={css.overlay}/>
        <PlantInfo
          plant={getSelectedPlant()}
          close={closeInfoModal}/>
        </>: null }
      {props.plants.map(plant => (
        <div key={plant.popular_name_pt_br} className={`${css.plantCard} ${props.myArea ? css.small :'' }`}>
          <div className={css.imageContainer} style={{backgroundImage: `url(${plant.image})`}} />
          <span className={css.mobileContainer}>
            <div className={css.infoContainer}>
              <h3 className={css.plantTitle}>{plant.popular_name_pt_br}</h3>
            </div>
            <div className={css.actionsContainer}>
              <div className={css.labelArea}>
                <button 
                  className={`${css.actionButton} ${css.garden} ${insideMyGardem(plant.id) ? css.active : ''}`}
                  onClick={() => setMyGarden(plant)}
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
              <div className={`${css.labelArea} ${css.infoButton}`}>
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
          </span>
        </div>
      ))}
    </div>
    {loginModalActive ?
      <>
        <span className={css.loginContainerOverlay} />
        <LoginModal
          close={toogleLoginModal}
          disclaimer={loginDisclaimer}/>
      </> : null}
    </>: <h1>LOADING</h1>
  );
});

export default plants;