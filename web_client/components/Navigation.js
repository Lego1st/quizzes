import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <div className="container navbar-container">      
            <div className="navbar-row">
              <div className="navbar-head">
                <span className="navbar-brand"><Link to='/'>? Quizzes</Link></span>
              </div>
              <div className="navbar-mid" role="search">
                <div className="navbar-mid-row">
                  <form className="input-group" id="searcher">
                    <input type="search" className="form-control" placeholder="What are you looking for?"/>
                  </form>
                  <li className="dropdown nav-category">
                    <a className="dropdown-toggle" data-toggle="dropdown" href="#">Category
                    <span className="caret"></span></a>
                    <ul className="dropdown-menu">
                      <li><Link to='/'>Math</Link></li>
                      <li><Link to='/category'>Animal</Link></li>
                      <li><Link to='/'>Color</Link></li>
                      <li><Link to='/'>Shape</Link></li>
                    </ul>
                  </li>
                  <div className="nav-category">
                    <Link to="/leaderboard">Leaderboard</Link>
                  </div>
                </div>
              </div>
              <div className="navbar-tail">
                <div className="navbar-tail-row">
                  <div id="create-quiz">
                    <i className="fas fa-plus-circle"></i>
                  </div>
                  <li className="dropdown nav-category" style={{padding: 0}}>
                    <div id="head-ava" className="dropdown-toggle" data-toggle="dropdown">
                      <Link to="/profile">
                        <img src={"/static/quizzes/images/default_avatar.jpg"} alt="default avatar" />
                      </Link>
                    </div>
                    <ul className="dropdown-menu">
                      <li><Link to='/profile'>Your Profile</Link></li>
                      <li><Link to='/'>Logout</Link></li>
                    </ul>
                  </li>
                </div>
              </div>  
              
            </div>    
          </div>
        </nav>
      </div>
    );
  }
}

export default Navigation;