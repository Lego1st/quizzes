import React, { Component } from 'react';
import Navigation from './Navigation';
import Home from './Home';
import Profile from './Profile';
import Category from './Category';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation/>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/profile' component={Profile}/>
            <Route path='/category' component={Category}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;