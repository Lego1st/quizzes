import React, { Component } from 'react';
import Navigation from './Navigation';
import Home from './Home';
import Profile from './Profile';
import Post from './Post';
import Favorite from './Favorite';
import Answered from './Answered';
import QuizCategory from './QuizCategory';
import LeaderBoard from './LeaderBoard';
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
            <Route path='/category' component={QuizCategory}/>
            <Route path='/myquizzes' component={Post}/>
            <Route path='/favorite' component={Favorite}/>
            <Route path='/answered' component={Answered}/>
            <Route path='/leaderboard' component={LeaderBoard}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;