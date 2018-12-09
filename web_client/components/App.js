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
import AddQuiz from './AddQuiz';
import Search  from './Search';
import EditQuiz from './EditQuiz';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {history} from 'history';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      is_staff: false
    };
  }

  setLoginState(state) {
    this.setState({
      logged_in: state
    })
  }
  setUser(user, is_staff){
    this.setState({
      username: user,
      is_staff: is_staff
    })
  }

  componentDidMount() {
    console.log(this.state.logged_in);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation setLoginState={this.setLoginState.bind(this)} username={this.state.username}
                      is_staff={this.state.is_staff}/>
          {this.state.logged_in ? 
            <Switch>
              <Route exact path="/" component={(props) => <Home 
                                    setUser={this.setUser.bind(this)} username={this.state.username} 
                                    is_staff={this.state.is_staff} {...props}/>}/>
              <Route path='/profile/:username' component={Profile}/>
              <Route path='/search/:search_text' component={Search} />
              <Route path='/category/:cate' component={QuizCategory}/>
              <Route path='/myquizzes/:username' component={Post}/>
              <Route path='/favorite/:username' component={Favorite}/>
              <Route path='/answered/:username' component={Answered}/>
              <Route path='/leaderboard' component={LeaderBoard}/>
              <Route path='/quizapproval' component={(props) => <QuizApproval 
                                          is_staff={this.state.is_staff} {...props}/>}/>
              <Route path='/quiz/:quizid' component={QuizDetail}/>
              <Route path='/quiz' component={QuizDetail}/>
              <Route path='/addquiz' component={AddQuiz}/>
              <Route path='/editquiz/:quizid' component={EditQuiz}/>
              <Route path='/login' component={(props) => <LoginSignUp 
                setLoginState={this.setLoginState.bind(this)} {...props}/>}/>
              <Redirect to='/'/>
            </Switch>
            :
            <Switch>
              <Route path='/login' component={(props) => <LoginSignUp 
                                    setLoginState={this.setLoginState.bind(this)} {...props}/>} />
              <Redirect to='/login'/>
            </Switch>
          }
        </div>
      </BrowserRouter>
    );
  }
}

export default App;