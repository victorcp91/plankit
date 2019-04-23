import React, { useState, useEffect } from 'react';
import firebase from "firebase/app";

import Api from '../libs/Api';

import css from './MyArea.module.scss';
import houseIcon from '../assets/icons/houseIcon.svg';

const myArea = props => {
  const [plants, setPlants] = useState([]);
  const [user, setUser] = useState(false)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });
  }, []);

  
  return(
    <div className={css.container}>
      <sidebar className={css.myAreaMenu}>
        <div className={css.selectedItemIcon}>
          <img className={css.icon} src={houseIcon} alt="Meu Jardim"/>
        </div>
        <ul>
          <li className={`${css.menuItem} ${css.myGarden}`}>
            <img className={css.icon} src={houseIcon} alt="Meu Jardim" />
            <span className={css.label}>Meu Jardim</span>
          </li>
          <li className={`${css.menuItem} ${css.myGarden}`}>
            <img className={css.icon} src={houseIcon} alt="Meu Jardim" />
            <span className={css.label}>Meus Desejos</span>
          </li>
          <li className={`${css.menuItem} ${css.myGarden}`}>
            <img className={css.icon} src={houseIcon} alt="Meu Jardim" />
            <span className={css.label}>Cadastrar Nova Espécie</span>
          </li>
          <li className={`${css.menuItem} ${css.myGarden}`}>
            <img className={css.icon} src={houseIcon} alt="Meu Jardim" />
            <span className={css.label}>Minha Loja</span>
          </li>
        </ul>
      </sidebar>
      <main className={css.content}>
        <h1>{user ?`Olá, ${user.displayName}!`: 'Olá!'}</h1>
      </main>
    </div>
  )
};

export default myArea;