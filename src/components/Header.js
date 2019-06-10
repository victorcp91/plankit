import React, { useState, useRef, useEffect } from 'react';
import firebase from "firebase/app";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { deleteUser } from '../store/user';


import Api from '../libs/Api';

import css from './Header.module.scss';
import logoIcon from '../assets/icons/plankitIcon.svg';
import userIcon from '../assets/icons/userIcon.svg';
import LoginModal from './LoginModal';


const header = props => {

  const [ menuActive, setMenuActive ] = useState(false);
  const [ loginModalActive, setLoginModalActive ] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
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
    deleteUser();
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
            {props.user.uid ?
            <img src={props.user.avatar} className={css.userAvatar} alt={props.user.display_name}/>
            :<img src={userIcon} className={css.userIcon} alt="User" />}
          </button>
          {menuActive ? 
            <ul className={css.userOptions}>
              {props.user.uid ? 
              <>
                <li className={css.option}>
                  <Link 
                    to="/minha-area"
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

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(header);