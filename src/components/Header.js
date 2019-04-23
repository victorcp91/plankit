import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from "firebase/app";

import css from './Header.module.scss';
import logoIcon from '../assets/icons/plankitIcon.svg';
import userIcon from '../assets/icons/userIcon.svg';
import LoginModal from './LoginModal';


const home = props => {
  const [ menuActive, setMenuActive ] = useState(false);
  const [ loginModalActive, setLoginModalActive ] = useState(false);
  const [ user , setUser ] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    }
  }, []);


  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setMenuActive(false);
    }
  };

  const toogleUserMenu = () => {
    setMenuActive(!menuActive);
  }

  const toogleLoginModal = () => {
    if(!loginModalActive){
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
    setLoginModalActive(!loginModalActive);
    setMenuActive(!menuActive);
  }

  const logout = () => {
    firebase.auth().signOut();
    setMenuActive(!menuActive);
    setUser(false);
  }

  return (
    <header className={css.header}>
      <div className={css.container}>
        <div className={css.logoContainer}>
          <Link to="/">
            <img src={logoIcon} className={css.logoIcon} alt="Logo Plankit" />
            <h1 className={css.logoName}>PLAN<span className={css.textGreen}>KI</span>T</h1>
          </Link>
        </div>
        <div className={css.userMenuContainer} ref={wrapperRef}>
          <button onClick={toogleUserMenu} className={css.userMenuButton}>
            {user ?
            <img src={user.photoURL} className={css.userAvatar} alt={user.displayName}/>
            :<img src={userIcon} className={css.userIcon} alt="User" />}
          </button>
          {menuActive ? 
            <ul className={css.userOptions}>
              {user ? 
              <>
                <li className={css.option}>
                  <Link 
                    to="minha-area"
                    className={css.link}>
                      Minha Área
                  </Link>
                </li>
                <li className={css.option}>
                  <button 
                    onClick={logout}
                    className={css.loginButton}>
                      Sair
                  </button>
                </li>
              </>
              :
              <li className={css.option}>
                <button 
                  onClick={toogleLoginModal}
                  className={css.loginButton}>
                    Entrar
                </button>
              </li>
              }
            </ul>
          : null}
        </div>
      </div>
      {loginModalActive ?
        <>
          <span className={css.loginContainerOverlay} />
          <LoginModal close={toogleLoginModal}/>
        </> : null}
    </header>
  )
};

export default home;