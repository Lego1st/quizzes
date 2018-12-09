import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { QUIZDECO } from './Constants';
import get_data from './Utils';

class Navigation extends Component {
  constructor(props) {
    super(props);
  }
  handle_logout = () => {
    this.props.setLoginState(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  handleSubmitSearch(e) {
    e.preventDefault();
    window.location.href = '/search/' + $("#search").val();
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <div className="container navbar-container">
            <div className="navbar-row">
              <div className="navbar-head">
                <span className="navbar-brand"><Link to='/'><img style={{ "height": "50px" }} src={QUIZDECO} /></Link></span>
              </div>
              <div className="navbar-mid" role="search">
                <div className="navbar-mid-row">
                  <form className="input-group" id="searcher" onSubmit={this.handleSubmitSearch.bind(this)}>
                    <input id="search" type="search" className="form-control" placeholder="What are you looking for?" />
                  </form>
                  <li className="dropdown nav-category">
                    <a className="dropdown-toggle" data-toggle="dropdown" href="#">Category
                    <span className="caret"></span></a>
                    <ul className="dropdown-menu" style={{ minWidth: "12rem" }}>
                      <li><Link to='/category/ma'>Math</Link></li>
                      <li><Link to='/category/cs'>Computer Science</Link></li>
                      <li><Link to='/category/lg'>Logic</Link></li>
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
                    <Link to="/addquiz">
                      <i className="fas fa-plus-circle"></i>
                    </Link>
                  </div>
                  <li className="dropdown nav-category" style={{ padding: 0 }}>
                    <div id="head-ava" className="dropdown-toggle" data-toggle="dropdown">
                      <Link to="/profile">
                        <img src={"/static/quizzes/images/default_avatar.jpg"} alt="default avatar" />
                      </Link>
                    </div>
                    <ul className="dropdown-menu">
                      <li><Link to={`/profile/${this.props.username}`}>Your Profile</Link></li>
                      <li><Link to='/login' onClick={this.handle_logout}>Logout</Link></li>
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