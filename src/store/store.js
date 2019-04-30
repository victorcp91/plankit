import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import plants from './plants';
import user from './user';

const reducer = combineReducers({
  plants,
  user
});

let store;

export const initStore = (initialState = {}) => {
  store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
  return store;
};

export const getStore = () => {
  if (store) {
    return store;
  }
  return initStore();
};
