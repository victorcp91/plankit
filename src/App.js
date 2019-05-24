import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getStore } from './store/store';

import './App.css';
import Header from './components/Header';
import Home from './containers/Home';
import MyArea from './containers/MyArea';
import Channel from './containers/Channel';

const app = props => {
  const store = getStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/minha-area" component={MyArea}/>
          <Route path="/:channel" component={Channel}/>
          <Route path="/" component={Home}/>
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default app;
