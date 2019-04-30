import React, { useEffect, useRef } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Api from '../libs/Api';
import { setUser } from '../store/user';

import css from './LoginModal.module.scss';

const loginModal = props => {

  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    }
  }, []);

  const signInSuccess = (auth) => {
    Api.getUserData(auth.user.uid).then((userData) => {
      if(!userData){
        Api.createUser(auth.user).then(() => {
          Api.getUserData(auth.user.uid).then((userData) => {
            setUser({ ...userData });
          })
        });
      }else{
        setUser({ ...userData });
      }
    })
    props.close();
  }

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => signInSuccess(authResult)
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    // tosUrl: '<your-tos-url>',
    // Privacy policy url.
    // privacyPolicyUrl: '<your-privacy-policy-url>'
  };


  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      props.close();
    }
  };

  return(
      <div className={`${css.loginContainer} ${props.disclaimer ? css.withDisclaimer : ''}`} ref={wrapperRef}>
        {props.disclaimer ?
          <p className={css.disclaimer}>
            {props.disclaimer}
          </p>
        : null}
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
  );
}

export default loginModal;