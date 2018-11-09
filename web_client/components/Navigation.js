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

                  <div id="category">
                    <Link to="/category">Category</Link>
                  </div>
                </div>
              </div>
              <div className="navbar-tail">
                <div className="navbar-tail-row">
                  <div id="create-quiz">
                    <i className="fas fa-plus-circle"></i>
                  </div>
                  <div id="head-ava">
                    <Link to="/profile">
                      N
                    </Link>
                  </div>
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