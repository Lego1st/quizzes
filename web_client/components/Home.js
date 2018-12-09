import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import QuizItem from "./QuizItem"
import TableView from './TableView';
import { QUIZDECO, HOMEDECO } from './Constants';
import get_data from './Utils';

var Config = require('Config');
const page_size = 5;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      next: null,
      recent_quizzes: []
    }
  }

  renderQuizList(quiz_list) {
    var quizzes = [];
    for (var i = 0; i < quiz_list.length; i++) {
      quizzes.push(<QuizItem key={i} info={quiz_list[i]} />)
    }
    return quizzes;
  }

  componentDidMount() {
    get_data(`/api/recent_quiz/?page_size=${page_size}`, true)
      .then(res => {
        return res.json();
      })
      .then((result) => {
        console.log("Result ", result);
        this.setState({
          next: result.next,
          recent_quizzes: result.results || []
        })
      },
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleScrollToBottom(completed) {
    // load more
    if (this.state.next == null) {
      completed();
      return;
    }
    get_data(this.state.next.replace(Config.serverUrl, ''), true).then(res => res.json()).then(result => {
      var newData = Object.assign([], this.state.recent_quizzes);
      newData.push.apply(newData, result.results);
      console.log("Scroll-load: ", result.results);
      completed();
      this.setState({
        recent_quizzes: newData,
        next: result.next
      })
    });
  }


  render() {

    return (
      <div className="container" id="home-page">


        <div className="row">

          <div className="col-sm-2" id="left-body">
            <div style={{ marginTop: "100px" }}>
              <img style={{ "height": "200px" }} src={HOMEDECO} />
            </div>
          </div>

          <div className="col-md-9" id="main-body" style={{ padding: "0 10px 20px 15px" }}>

            <div id="qz_pending_list" style={{ padding: "20px", height: "auto" }}>
              <div className="qz_list_title">
                Recent quizzes
              </div>
              {(this.state.recent_quizzes.length == 0) ? (
                <div style={{ textAlign: 'center' }}>
                  <h3>It looks like we currently do not have any post yet ^^</h3>

                  <h4>Click
                      <Link to="/addquiz">
                      <i className="fas fa-plus-circle" style={{ margin: '1%' }}></i>
                    </Link>
                    to add one!
                        </h4>
                </div>
              ) : (
                  <TableView
                    ref="recent_quizzes"
                    dataSource={this.state.recent_quizzes}
                    onScrollToBottom={this.handleScrollToBottom.bind(this)}
                  />
                )}

            </div>

            {/* <div id="qz_pending_list">
              <div className="qz_list_title">
                Top quiz
              </div>
              {this.renderQuizList(this.state.top_quiz_list)}
            </div> */}

          </div>
        </div>
      </div>
    );
  }
}

export default Home;