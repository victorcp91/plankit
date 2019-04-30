import React, { useState, useEffect } from 'react';
import firebase from "firebase/app";
import { connect } from 'react-redux';

import Api from '../libs/Api';
import { setPlants }  from  '../store/plants';
import { setUser, addGardemPlant, removeGardemPlant } from '../store/user';

import css from './Home.module.scss';
import MainSlider from '../components/MainSlider';
import PresentationArea from '../components/PresentationArea';
import Search from '../components/Search';
import Filters from '../components/Filters';
import Plants from '../components/Plants';

const home = props => {

  useEffect(() => {
    Api.getPlants().then((res) => {
      setPlants(res);
    });
  }, []);

  const addToGardem = (plant) => {
    const user = { ...props.user };
    addGardemPlant(user, plant);
    Api.addGardemPlant(user, plant).then(() => {
      Api.getUserData(props.user.uid).then(userData => {
        setUser({ ...userData });
      });
    });
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

  
  return(
    <div className={css.container}>
      <MainSlider />
      <PresentationArea />
      <Search />
      <Filters />
      <Plants
        plants={props.plants}
        user={props.user}
        addGardemPlant={addToGardem}
        removeGardemPlant={removeFromGardem}
        />
    </div>
  )
};

const mapStateToProps = ({ plants, user }) => ({ plants, user });

export default connect(mapStateToProps)(home);