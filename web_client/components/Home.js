import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container" id="home-page">
        <div className="row">

          <div className="col-sm-3" id="left-body">
            <div id="home-category"> Category </div>
            <ul id="home-cate-list">
              <li>Math</li>
              <li>Animal</li>
              <li>Color</li>
              <li>Shape</li>
            </ul>
          </div>

          <div className="col-sm-6" id="main-body">

            <div id="qz_pending_list">
              <div className="qz_list_title">
                Quiz for you
          </div>
              <div className="qz_quiz_item">
                <div className="qz_quiz_title">Get started wit Quizzes</div>
                <div className="qz_quiz_desc">Brief description here...</div>
                <div className="qz_quiz_rating">
                  <span className="qz_rating"></span>
                  <span className="qz_rating"></span>
                  <span className="qz_rating"></span>
                </div>
              </div>
              <div className="qz_quiz_item">
                <div className="qz_quiz_title">How Quizzes rank you ?</div>
                <div className="qz_quiz_desc">Brief description here...</div>
                <div className="qz_quiz_rating">
                  <span className="qz_rating"></span>
                  <span className="qz_rating"></span>
                </div>
              </div>
            </div>

            <div id="qz_pending_list">
              <div className="qz_list_title">
                Top quiz
          </div>
              <div className="qz_quiz_item">
                <div className="qz_quiz_title">Quiz 1</div>
                <div className="qz_quiz_desc">Brief description here...</div>
                <div className="qz_quiz_rating">
                  <span className="qz_rating"></span>
                  <span className="qz_rating"></span>
                  <span className="qz_rating"></span>
                </div>
              </div>
              <div className="qz_quiz_item">
                <div className="qz_quiz_title">Quiz 2</div>
                <div className="qz_quiz_desc">Brief description here...</div>
                <div className="qz_quiz_rating">
                  <span className="qz_rating"></span>
                  <span className="qz_rating"></span>
                </div>
              </div>
              <div className="qz_quiz_item">
                <div className="qz_quiz_title">Quiz 3</div>
                <div className="qz_quiz_desc">Brief description here...</div>
                <div className="qz_quiz_rating">
                  <span className="qz_rating"></span>
                  <span className="qz_rating"></span>
                </div>
              </div>
            </div>

          </div>
          <div className="col-sm-3" id="right-body"></div>
        </div>
      </div>
    );
  }
}

export default Home;