import { getStore } from './store';

const SET_PLANTS = 'PLANTS/SET_PLANTS';

export function setPlants(plants) {
  getStore().dispatch({ type: SET_PLANTS, plants });
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
