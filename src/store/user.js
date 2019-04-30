import { getStore } from './store';

const SET_USER = 'USER/SET_USER';
const DELETE_USER = 'USER/DELETE_USER';
const UPDATE_USER = 'USER/UPDATE_USER';

export function setUser(user) {
  getStore().dispatch({ type: SET_USER, user });
}

export function deleteUser() {
  getStore().dispatch({ type: DELETE_USER });
}

export async function addGardemPlant(user, plant) {
  let gardem = user.gardem;
  const newPlant = {
    id: plant.id,
    image: plant.image,
    popular_name_pt_br: plant.popular_name_pt_br,
  }
  gardem.push(newPlant);
  let updatedUser = {
    ...user,
    gardem
  }

  getStore().dispatch({ type: UPDATE_USER, updatedUser });
  
}

export function removeGardemPlant(plantId) {
  const user = getStore().getState().user;
  const gardem = user.gardem.filter(plant => plant.id !== plantId)
  let updatedUser = {
    ...user,
    gardem: gardem ? gardem : []
  }
  getStore().dispatch({ type: UPDATE_USER, updatedUser });
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_USER: {
      return Object.assign({}, action.user);
    }
    case UPDATE_USER: {
      return Object.assign({}, state, action.updatedUser);
    }
    case DELETE_USER: {
      return {};
    }
    default:
      return state;
  }
}
