import React, { Component } from 'react';
import Navigation from './Navigation';
import Home from './Home';
import Profile from './Profile';
import Post from './Post';
import Favorite from './Favorite';
import Answered from './Answered';
import QuizCategory from './QuizCategory';
import LeaderBoard from './LeaderBoard';
import QuizApproval from './QuizApproval';
import QuizDetail from './QuizDetail';
import LoginSignUp from './LoginSignUp';
import PrivateRoute from './PrivateRoute';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {history} from 'history';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: localStorage.getItem('token') ? true : false,
      username: ''
    };
  }

  render() {


    return (
      <BrowserRouter>
        <div>
          <Navigation/>
          <Switch>
            <Route path="/dashboard" component={Home}/>
            <Route path='/login' component={LoginSignUp}/>
            <Route path='/profile' component={Profile}/>
            <Route path='/category' component={QuizCategory}/>
            <Route path='/myquizzes' component={Post}/>
            <Route path='/favorite' component={Favorite}/>
            <Route path='/answered' component={Answered}/>
            <Route path='/leaderboard' component={LeaderBoard}/>
            <Route path='/quizapproval' component={QuizApproval}/>
            <Route path='/quiz' component={QuizDetail}/>
            <PrivateRoute path='/'  logged_in={this.state.logged_in} component={App}/>


          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;