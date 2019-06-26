import { getStore } from './store';

const SET_CHANNELS = 'PLANTS/SET_CHANNELS';

export function setChannels(channels) {
  const currentChannels = getStore().getState().channels;
  if(channels && channels.length) {
    channels.forEach(channel => {
      const index = currentChannels.findIndex(el => el.id === channel.id);
      if(index > -1){
        currentChannels[index] = { ...currentChannels[index], ...channel, subscribers: channel.subscribers};
      } else {
        currentChannels.push(channel);
        console.log('teste',currentChannels);
      }
      
    });
  } 
  getStore().dispatch({ type: SET_CHANNELS, currentChannels });
}

export function setChannelPosts(channelId, posts) {
  const currentChannels = getStore().getState().channels;
  const channelIndex = currentChannels.findIndex(channel => channel.id === channelId);
  if(channelIndex > -1){
    currentChannels[channelIndex].posts = posts;
    getStore().dispatch({ type: SET_CHANNELS, currentChannels });
  }
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
