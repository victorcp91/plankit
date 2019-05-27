import React, { useEffect, useState } from 'react';
import firebase from "firebase/app";
import { connect } from 'react-redux';

import Api from '../libs/Api';
import { setPlants }  from  '../store/plants';
import { deleteUser, setUser, addGardemPlant, removeGardemPlant } from '../store/user';

import css from './Home.module.scss';
import MainSlider from '../components/MainSlider';
import PresentationArea from '../components/PresentationArea';
import Search from '../components/Search';
import Filters from '../components/Filters';
import Plants from '../components/Plants';

const home = props => {
  const [filteredPlants, setFilteredPlants] = useState(null);
  const [hideFilters, setHideFilters] = useState(null);
  const [findFilters, setFindFilters] = useState(null);
  const [loadingPlants, setLoadingPlants] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMethod, setSortMethod] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    setLoadingPlants(true);
    Api.getPlants().then((res) => {
      setPlants(res);
      setLoadingPlants(false);
    });
    Api.getFeaturedPosts().then((res) => {
      setFeaturedPosts(res);
    })
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Api.getUserData(user.uid).then(userData => {
          setUser({ ...userData });
        });
      } else {
        deleteUser();
      }
    })}, []);

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

  const getFilteredPlants = (filters) => {
    if(filters.length){
      setLoadingPlants(true);
      const find = filters.filter(f => !f.includes('hide'));
      const hide = filters.filter(f => f.includes('hide'));
      setHideFilters(hide);
      setFindFilters(find);
      Api.getFilteredPlants(find).then(res => {
        setPlants(res);
        setLoadingPlants(false);
      })
    }else{
      setHideFilters(null);
      setFindFilters(null);
    }
  }

  const comparableString = term => {
    let preparedString = term.toLowerCase();
    const before = 'áàãâäéèêëíìîïóòõôöúùûü-';
    const converted = 'aaaaaeeeeiiiiooooouuuu ';
    let finalString = '';
    for(let i=0; i < preparedString.length; i++) {
      if(before.includes(preparedString[i])){
        const index = before.indexOf(preparedString[i]);
        finalString += converted[index];
      } else {
        finalString += preparedString[i];
      }

    }
    return finalString;
  }

  const compareStrings = (plantName, searchTerm) => {
    const comparablePlantName = comparableString(plantName);
    const comparableSearchTerm =  comparableString(searchTerm);
    const searchWords = comparableSearchTerm.split(' ');
    let found = true;
    for(let i = 0; i< searchWords.length; i++){
      if(!comparablePlantName.includes(searchWords[i])){
        found = false;
      }
    }
    return found;
  }

  const filterPlants = () => {
    let filteredPlants = props.plants;
    if (searchTerm) {
      filteredPlants = filteredPlants
        .filter(plant =>  compareStrings(plant.popular_name_pt_br, searchTerm) ||
        compareStrings(plant.scientific_name,searchTerm));
    }

    if(findFilters && findFilters.length) {
      findFilters.forEach(filter => {
        filteredPlants = filteredPlants.filter(plant => plant.tags.includes(filter));
      });
    }
    if(hideFilters && hideFilters.length){
      hideFilters.forEach(filter => {
        filteredPlants = filteredPlants.filter(f => !f.tags.includes(filter.split('hide_')[1]));
        if(filter.split('hide_')[1] === 'dangerous'){
          filteredPlants = filteredPlants.filter(f => !f.tags.includes('thorns') && !f.tags.includes('poisonous'));
        }
        if(filter.split('hide_')[1] === 'vegetable_garden'){
          filteredPlants = filteredPlants.filter(f => !f.tags.includes('vegetable_leaves') 
          && !f.tags.includes('vegetable')
          && !f.tags.includes('herbs')
          && !f.tags.includes('pancs'));
        }
      })
    }
    switch(sortMethod){
      case 'ascending':
        filteredPlants = filteredPlants.sort();
        break;
      case 'descending':
          filteredPlants = filteredPlants.reverse();
        break;
      case 'byDate':
        filteredPlants = filteredPlants.sort();
        break;
      default:
        filteredPlants = filteredPlants.sort();
    }
    return filteredPlants;
  }

  const setCurrentSearchTerm = term => {
    setSearchTerm(term);
  }

  const setPlantsSort = sort => {
    setSortMethod(sort);
  }

  return(
    <div className={css.container}>
      <MainSlider slides={featuredPosts}/>
      <PresentationArea text="Etiam luctus tincidunt justo in aliquam. Nulla quam diam, auctor et turpis nec, bibendum vehicula velit. Nulla sollicitudin ornare justo, a blandit est vehicula a. Integer imperdiet tortor eget congue consequat. Provitae justo auctor fermentum aliquet a sem." />
      <Search
        searchTerm={setCurrentSearchTerm}
        order={setPlantsSort}
      />
      <Filters setFilters={getFilteredPlants}/>
      <Plants
        plants={filterPlants()}
        user={props.user}
        addGardemPlant={addToGardem}
        removeGardemPlant={removeFromGardem}
        loading={loadingPlants}
      />
    </div>
  )
};

const mapStateToProps = ({ plants, user }) => ({ plants, user });

export default connect(mapStateToProps)(home);