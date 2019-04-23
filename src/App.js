import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Header from './components/Header';
import Home from './containers/Home';
import MyArea from './containers/MyArea';

const app = props => {
    return (
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/minha-area" component={MyArea}/>
          <Route path="/" component={Home}/>
        </Switch>
      </BrowserRouter>
    );
}

export default app;
