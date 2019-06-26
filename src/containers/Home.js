import React, { useEffect, useState } from 'react';
import firebase from "firebase/app";
import Switch from "react-switch";
import { connect } from 'react-redux';
import Api from '../libs/Api';
import moment from 'moment';
import { setPlants }  from  '../store/plants';
import { deleteUser, setUser, addGardemPlant, removeGardemPlant } from '../store/user';
import { comparableString } from '../libs/Utils';

import css from './Home.module.scss';
import MainSlider from '../components/MainSlider';
import PresentationArea from '../components/PresentationArea';
import Search from '../components/Search';
import Filters from '../components/Filters';
import Plants from '../components/Plants';
import Channels from  '../components/Channels';
import Posts from '../components/Posts';
import { setChannels, setChannelPosts } from '../store/channels';

const home = props => {
  const [filteredPlants, setFilteredPlants] = useState(null);
  const [hideFilters, setHideFilters] = useState(null);
  const [findFilters, setFindFilters] = useState(null);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [foundPosts, setFoundPosts] = useState(null);
  const [sortMethod, setSortMethod] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [activeSection, setActiveSection] = useState('channels');

  useEffect(() => {
    setLoadingChannels(true);
    Api.getChannels().then(res => {
      setChannels(res);
      setLoadingChannels(false);
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

  useEffect(() => {
    let filterTimer = setTimeout(()=> {
      if(searchTerm){
        if(activeSection === 'plants'){
          setLoadingPlants(true);
          Api.getFilteredPlants(findFilters, searchTerm).then(res => {
            setPlants(res);
            setLoadingPlants(false);
          })
        } else {
          setLoadingChannels(true);
          Api.getSearchedChannels(searchTerm).then(res => {
            setChannels(res.channels);
            if(res.posts && res.posts.length){
              setFoundPosts(res.posts);
              res.posts.forEach(post => {
                setChannelPosts(post.channel, [post]);
              })
            }
            setLoadingChannels(false);
          })
        }
      } else {
        setFoundPosts(null);
      }
    },1500);
    return () => {
      clearTimeout(filterTimer)
    };
  }, [searchTerm]);


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
      Api.getFilteredPlants(find, searchTerm).then(res => {
        setPlants(res);
        setLoadingPlants(false);
      })
    }else{
      setHideFilters(null);
      setFindFilters(null);
    }
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

    const otherNames = (names, key) => {
      let contains = false;
      names.forEach(name => {
        if(comparableString(name).includes(key)){
          contains = true;
        }
      });
      return contains;
    }

    if (searchTerm) {
      filteredPlants = filteredPlants
        .filter(plant =>  compareStrings(plant.popularNamePtBr, searchTerm) ||
        otherNames(plant.otherPopularNamesPtBr, searchTerm) ||
        compareStrings(plant.scientificName,searchTerm));
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
        filteredPlants = filteredPlants.sort((a,b) => {
          if ( a.popularNamePtBr < b.popularNamePtBr ){
            return -1;
          }
          if ( a.popularNamePtBr > b.popularNamePtBr ){
            return 1;
          }
          return 0;
        });
        break;
      case 'descending':
        filteredPlants = filteredPlants.sort((a,b) => {
          if ( a.popularNamePtBr < b.popularNamePtBr ){
            return 1;
          }
          if ( a.popularNamePtBr > b.popularNamePtBr ){
            return -1;
          }
          return 0;
        });
        break;
      case 'byDate':
        filteredPlants = filteredPlants.sort();
        break;
      default:
        filteredPlants = filteredPlants.sort();
    }
    return filteredPlants;
  }

  const filterChannels = () => {

    const tags = (names, key) => {
      let contains = false;
      names.forEach(tag => {
        if(comparableString(tag).includes(key)){
          contains = true;
        }
      });
      return contains;
    }

    let filteredChannels = props.channels;
    if (searchTerm) {
      let keywords = searchTerm;
      const finalKeywords = comparableString(keywords).split(' '); 
      finalKeywords.forEach(key => {
        filteredChannels = filteredChannels.filter(channel => (comparableString(channel.name).includes(key) ||
        tags(channel.tags, key)));
      });
    }
    if(filteredChannels) {

      switch(sortMethod){
        case 'ascending':
          filteredChannels = filteredChannels.sort((a,b) => {
            if ( a.name < b.name ){
              return -1;
            }
            if ( a.name > b.name ){
              return 1;
            }
            return 0;
          });
          break;
        case 'descending':
          filteredChannels = filteredChannels.sort((a,b) => {
            if ( a.name < b.name ){
              return 1;
            }
            if ( a.name > b.name ){
              return -1;
            }
            return 0;
          });
          break;
        case 'byDate':
          break;
        default:
          break;
      }

      return filteredChannels;
    } return false;
    
  }

  const filterPosts = () => {
    let filteredPosts = foundPosts;
    if (searchTerm) {
      let keywords = searchTerm;
      const finalKeywords = comparableString(keywords).split(' '); 
      finalKeywords.forEach(key => {
        filteredPosts = filteredPosts.filter(post => (comparableString(post.title).includes(key) ||
        comparableString(post.description).includes(key)));
      });
    }
    if(filteredPosts) {
      switch(sortMethod){
        case 'ascending':
          filteredPosts = filteredPosts.sort((a,b) => {
            if ( a.title < b.title ){
              return -1;
            }
            if ( a.title > b.title ){
              return 1;
            }
            return 0;
          });
          break;
        case 'descending':
          filteredPosts = filteredPosts.sort((a,b) => {
            if ( a.title < b.title ){
              return 1;
            }
            if ( a.title > b.title ){
              return -1;
            }
            return 0;
          });
          break;
        case 'byDate':
          filteredPosts = filteredPosts.sort((a,b) => moment(b.createdAt).format('YYYYMMDD') - moment(a.createdAt).format('YYYYMMDD'));
          break;
        default:
          filteredPosts = filteredPosts.sort((a,b) => moment(b.createdAt).format('YYYYMMDD') - moment(a.createdAt).format('YYYYMMDD'));
          break;
      }
      return filteredPosts;
    } return [];
  }

  const setCurrentSearchTerm = term => {
    setSearchTerm(term);
  }

  const setResultSort = sort => {
    setSortMethod(sort);
    console.log(sort)
  }
  
  const toogleSection = () => {
    if(activeSection === 'channels'){
      setActiveSection('plants');
      if(!props.plants.length){
        setLoadingPlants(true);
        Api.getPlants().then((res) => {
          setPlants(res);
          setLoadingPlants(false);
        });
      }
    } else {
      setActiveSection('channels');
    }
  }
  const orderedPosts = () => {
    let posts = featuredPosts;
    switch(sortMethod){
      case 'ascending':
        posts = posts.sort((a,b) => {
          if ( a.title < b.title ){
            return -1;
          }
          if ( a.title > b.title ){
            return 1;
          }
          return 0;
        });
        break;
      case 'descending':
        posts = posts.sort((a,b) => {
          if ( a.title < b.title ){
            return 1;
          }
          if ( a.title > b.title ){
            return -1;
          }
          return 0;
        });
        break;
      case 'byDate':
        posts = posts.sort((a,b) => moment(b.createdAt).format('YYYYMMDD') - moment(a.createdAt).format('YYYYMMDD'));
        break;
      default:
        posts = posts.sort((a,b) => {
          if ( a.populartitlePtBr < b.populartitlePtBr ){
            return 1;
          }
          if ( a.populartitlePtBr > b.populartitlePtBr ){
            return -1;
          }
          return 0;
        });
        break;
    }
    return posts;
  }

  return(
    <div className={css.container}>
      <MainSlider slides={featuredPosts}/>
      <PresentationArea text="Etiam luctus tincidunt justo in aliquam. Nulla quam diam, auctor et turpis nec, bibendum vehicula velit. Nulla sollicitudin ornare justo, a blandit est vehicula a. Integer imperdiet tortor eget congue consequat. Provitae justo auctor fermentum aliquet a sem." />
      <div className={css.switchArea}>
        <button>Canais</button>
        <Switch
          height={22}
          width={40}
          uncheckedIcon={false}
          checkedIcon={false}
          offColor="#49a25a"
          onColor="#49a25a"
          className={css.switch}
          checked={activeSection === 'plants' ? true : false }
          onChange={toogleSection}
        />
        <button>Plantas</button>
      </div>
      <Search
        searchTerm={setCurrentSearchTerm}
        order={setResultSort}
        placeholder={activeSection === 'channels' ? 'Buscar canal' : 'Buscar planta'}
        activeSection={activeSection}
      />
      {activeSection === 'channels' ? 
        <div className={css.channelResults}>
          {searchTerm && 
            <Channels
              channels={filterChannels()}
            />}
          {searchTerm && foundPosts && 
            <Posts posts={filterPosts()}/>}
          <h2 className={css.lastPosts}>Últimas postagens:</h2>
          <Posts posts={orderedPosts()}/>
        </div>
        :<>
          <Filters setFilters={getFilteredPlants}/>
          <Plants
            plants={filterPlants()}
            user={props.user}
            addGardemPlant={addToGardem}
            removeGardemPlant={removeFromGardem}
            loading={loadingPlants}
          />
        </>
      }
      
    </div>
  )
};

const mapStateToProps = ({ plants, channels, user }) => ({ plants, channels, user });

export default connect(mapStateToProps)(home);