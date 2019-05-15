import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Api from '../libs/Api';
import { setUser, removeGardemPlant } from '../store/user';

import css from './MyArea.module.scss';
import Plants from '../components/Plants';
import NewPlant from '../components/NewPlant';
import SellerForm from '../components/SellerForm';
// import optionsIcon from '../assets/icons/optionsIcon.svg';
import houseIcon from '../assets/icons/houseIcon.svg';
// import heartIcon from '../assets/icons/heartIcon.svg';
import myWishesIcon from '../assets/icons/myWishesIcon.svg';
import newPlantIcon from '../assets/icons/newPlantIcon.svg';



const myArea = props => {
  const [currentSection, setCurrentSection] = useState('newPlant');
  const [iconAnimation, setIconAnimation] = useState(false);

  useEffect(() => {
    setIconAnimation(false);
    setTimeout(() => {
      setIconAnimation(true);
    }, 100);
  }, [currentSection]);
  

  const setMyGardenSection = () => {
    setCurrentSection('myGarden');
  }
  // const setMyWishesSection = () => {
  //   setCurrentSection('myWishes');
  // }
  const setNewPlantSection = () => {
    setCurrentSection('newPlant');
  }
  const setMyStoreSection = () => {
    setCurrentSection('myStore');
  }
  const setMyChannelSection = () => {
    setCurrentSection('myChannel');
  }

  const loadSectionIcon = () => {
    switch(currentSection){
      case 'myGarden': 
        return houseIcon;
      case 'myWishes': 
        return myWishesIcon;
      case 'newPlant': 
        return newPlantIcon;
      case 'myStore': 
        return houseIcon;
      case 'myChannel': 
        return houseIcon;
      default:
        return null
    }
  }

  const removeFromGardem = (plant) => {
    const user = { ...props.user };
    removeGardemPlant(plant.id);
    Api.removeGardemPlant(user,plant).then(() => {
      Api.getUserData(props.user.uid).then(userData => {
        setUser({ ...userData });
      });
    });
  }

  const myGardem = () => {
    return (
      <Plants
        plants={props.user.gardem}
        user={props.user}
        removeGardemPlant={removeFromGardem} 
        myArea
      />
    )
  }
  
  return(
    <div className={css.container}>
      <aside className={css.myAreaMenu}>
        <div className={`${css.selectedItemIcon}  ${iconAnimation ? css.animate : '' }`}>
          <img className={css.icon} src={loadSectionIcon()} alt="Meu Jardim"/>
        </div>
        <ul>
          <li className={`${css.menuItem} ${css.myGarden} ${currentSection === 'myGarden' ? css.active : ''}`}>
            <button onClick={setMyGardenSection}>
              <img className={css.icon} src={houseIcon} alt="Meu Jardim" />
              <span className={css.label}>Meu Jardim</span>
            </button>
          </li>
          {/* <li className={`${css.menuItem} ${css.myGarden} ${currentSection === 'myWishes' ? css.active : ''}`}>
            <button onClick={setMyWishesSection}>
              <img className={css.icon} src={myWishesIcon} alt="Meus Desejos" />
              <span className={css.label}>Meus Desejos</span>
            </button>
          </li> */}
          <li className={`${css.menuItem} ${css.myGarden} ${currentSection === 'newPlant' ? css.active : ''}`}>
            <button onClick={setNewPlantSection}>
              <img className={css.icon} src={newPlantIcon} alt="Cadastrar Nova Espécie" />
              <span className={css.label}>Nova Espécie</span>
            </button>
          </li>
          <li className={`${css.menuItem} ${css.myGarden} ${currentSection === 'myStore' ? css.active : ''}`}>
            <button onClick={setMyStoreSection}>
              <img className={css.icon} src={houseIcon} alt="Meu Jardim" />
              <span className={css.label}>Cadastrar Loja</span>
            </button>
          </li>
          <li className={`${css.menuItem} ${css.myGarden} ${currentSection === 'myChannel' ? css.active : ''}`}>
            <button onClick={setMyChannelSection}>
              <img className={css.icon} src={houseIcon} alt="Meu Canal" />
              <span className={css.label}>Meu Canal</span>
            </button>
          </li>
        </ul>
      </aside>
      <main className={css.content}>
        <div className={css.welcomeArea}>
          <h1 className={css.welcome}>{props.user.display_name ?`Bom dia, ${props.user.display_name.split(' ')[0]}!`: 'Bom dia!'}</h1>
        </div>
        {currentSection === 'myGarden' && myGardem()}
        {/* {currentSection === 'myWishes' && <div>My Wishes</div>} */}
        {currentSection === 'newPlant' && <NewPlant/>}
        {currentSection === 'myStore' &&  <SellerForm user={props.user}/>}
        {currentSection === 'myChannel' &&  <h1>Canal</h1>}

      </main>
    </div>
  )
};
const mapStateToProps = ({ plants, user }) => ({ plants, user });

export default connect(mapStateToProps)(myArea);