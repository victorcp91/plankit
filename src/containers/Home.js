import React, { useState, useEffect } from 'react';

import Api from '../libs/Api';

import css from './Home.module.scss';
import MainSlider from '../components/MainSlider';
import PresentationArea from '../components/PresentationArea';
import Search from '../components/Search';
import Filters from '../components/Filters';
import Plants from '../components/Plants';

const home = props => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    Api.getPlants().then((res) => {
      setPlants(res);
      console.log(res)
    });
  }, []);

  
  return(
    <div className={css.container}>
      <MainSlider />
      <PresentationArea />
      <Search />
      <Filters />
      <Plants plants={plants}/>
    </div>
  )
};

export default home;