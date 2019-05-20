import React, { useState, useEffect } from 'react';
import firebase from "firebase/app";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Api from '../libs/Api';

import { deleteUser } from '../store/user';
import { setUser, removeGardemPlant } from '../store/user';

import css from './MyArea.module.scss';
import Plants from '../components/Plants';
import NewPlant from '../components/NewPlant';
import SellerForm from '../components/SellerForm';
import MyChannel from '../components/MyChannel';
import MyPosts from '../components/MyPosts';
// import optionsIcon from '../assets/icons/optionsIcon.svg';
import houseIcon from '../assets/icons/houseIcon.svg';
// import heartIcon from '../assets/icons/heartIcon.svg';
import myWishesIcon from '../assets/icons/myWishesIcon.svg';
import newPlantIcon from '../assets/icons/newPlantIcon.svg';
import { setChannels } from '../store/channels';



const myArea = props => {
  const [currentSection, setCurrentSection] = useState('myPosts');
  const [iconAnimation, setIconAnimation] = useState(false);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Api.getUserData(user.uid).then(userData => {
          setUser({ ...userData });
          if(userData.channelOwnerPermission && userData.channelOwnerPermission === 'approved') {
            Api.getMyChannels(user.uid).then(channels => {
              setChannels(channels);
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        })
      } else {
        deleteUser();
        props.history.push(`/`);
      }
    });
  }, []);

  useEffect(() => {
    setIconAnimation(false);
    setTimeout(() => {
      setIconAnimation(true);
    }, 100);
  }, [currentSection]);
  

  const setMyGardenSection = () => {
    setCurrentSection('myGarden');
  }
  const setNewPlantSection = () => {
    setCurrentSection('newPlant');
  }
  const setMyStoreSection = () => {
    setCurrentSection('myStore');
  }
  const setMyChannelSection = () => {
    setCurrentSection('myChannel');
  }
  const setMyPostsSection = () => {
    setCurrentSection('myPosts');
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

  const myChannels = () => {
    const channels = props.channels.filter(channel => channel.owner === props.user.uid);
    if(channels.length){
      return channels[0];
    } return null;
  }
  
  const getDayTimeGreenting = () => {
    const hour = moment().format("HH");
    if(hour > 6 && hour < 12) {
      return 'Bom dia';
    } else if( hour >= 12 && hour < 18){
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  }

  return(
   loading ? <h1>CARREGANDO</h1> 
    :<div className={css.container}>
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
          <li className={`${css.menuItem} ${css.myGarden} ${currentSection === 'myPosts' ? css.active : ''}`}>
            <button onClick={setMyPostsSection}>
              <img className={css.icon} src={myWishesIcon} alt="Meus Desejos" />
              <span className={css.label}>Meus Posts</span>
            </button>
          </li>
        </ul>
      </aside>
      <main className={css.content}>
        <div className={css.welcomeArea}>
          <h1 className={css.welcome}>{props.user.display_name ?`${getDayTimeGreenting()}, ${props.user.display_name.split(' ')[0]}!`: `${getDayTimeGreenting()}!`}</h1>
        </div>
        {currentSection === 'myGarden' && myGardem()}
        {currentSection === 'newPlant' && <NewPlant user={props.user}/>}
        {currentSection === 'myStore' &&  <SellerForm user={props.user}/>}
        {currentSection === 'myChannel' &&  <MyChannel user={props.user} channel={myChannels()}/>}
        {currentSection === 'myPosts' && <MyPosts channel={myChannels()}/>}

      </main>
    </div>
  )
};
const mapStateToProps = ({ plants,channels, user }) => ({ plants,channels, user });

export default connect(mapStateToProps)(myArea);