import { getStore } from './store';

const SET_PLANTS = 'PLANTS/SET_PLANTS';

export function setPlants(plants) {
  const currentPlants = getStore().getState().plants;
  if(plants && plants.length) {
    plants.forEach(plant => {
      const index = currentPlants.findIndex(el => el.id === plant.id);
      if(index > -1){
        currentPlants[index] = { ...currentPlants[index], ...plant};
      } else {
        currentPlants.push(plant);
      }
    });
  } 
  getStore().dispatch({ type: SET_PLANTS, currentPlants });
}

export default function reducer(state = [], action) {
  switch (action.type) {
    case SET_PLANTS: {
      return Object.assign([], state, action.plants);
    }
    default:
      return state;
  }
}
