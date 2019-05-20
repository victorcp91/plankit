import { getStore } from './store';

const SET_CHANNELS = 'PLANTS/SET_CHANNELS';

export function setChannels(channels) {
  const currentChannels = getStore().getState().channels;
  if(channels && channels.length) {
    channels.forEach(channel => {
      const index = currentChannels.findIndex(el => el.id === channel.id);
      if(index > -1){
        currentChannels[index] = { ...currentChannels[index], ...channel};
      } else {
        currentChannels.push(channel);
      }
    });
  } 
  getStore().dispatch({ type: SET_CHANNELS, currentChannels });
}

export default function reducer(state = [], action) {
  switch (action.type) {
    case SET_CHANNELS: {
      return Object.assign([], state, action.channels);
    }
    default:
      return state;
  }
}
