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
      next_top: null,
      list_type: "Recent quizzes",
      recent_quizzes: [],
      top_quizzes: []
    }
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
      );
    get_data(`/api/top_quiz/?page_size=${page_size}`, true)
      .then(res => {
        return res.json();
      })
      .then((result) => {
        console.log("Result ", result);
        this.setState({
          next_top: result.next,
          top_quizzes: result.results || []
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


  handleScrollToBottomTopQuizzes(completed) {
    // load more
    if (this.state.next_top == null) {
      completed();
      return;
    }
    get_data(this.state.next_top.replace(Config.serverUrl, ''), true).then(res => res.json()).then(result => {
      var newData = Object.assign([], this.state.top_quizzes);
      newData.push.apply(newData, result.results);
      completed();
      this.setState({
        top_quizzes: newData,
        next_top: result.next
      })
    });
  }

  handleChangeListType(event) {
    this.setState({ list_type: event.currentTarget.textContent });
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

            <div id="qz_pending_list" style={{ padding: "10px", height: "auto" }}>
              <div style={{ padding: "0 0 5% 5%"}}>
                <div className="input-group-prepend">
                  <a className="dropdown-toggle toTitle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{fontSize : "24px"}}> {this.state.list_type} </a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" onClick={this.handleChangeListType.bind(this)}>Recent quizzes</a>
                    <a className="dropdown-item" onClick={this.handleChangeListType.bind(this)}>Top quizzes</a>
                  </div>
                </div>
              </div>
              {
                this.state.list_type == "Recent quizzes"
                ? 
                (<TableView
                  key="recent_quizzes"
                  ref="recent_quizzes"
                  dataSource={this.state.recent_quizzes}
                  onScrollToBottom={this.handleScrollToBottom.bind(this)}
                />)
                :
                (<TableView
                  key="top_quizzes"
                  ref="top_quizzes"
                  dataSource={this.state.top_quizzes}
                  onScrollToBottom={this.handleScrollToBottomTopQuizzes.bind(this)}
                />)
              }

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;