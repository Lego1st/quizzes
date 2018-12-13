import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import QuizItem from "./QuizItem"
import TableView from './TableView';
import { QUIZDECO, HOMEDECO } from './Constants';
import get_data from './Utils';

var Config = require('Config');
const page_size = 5;

function fetchData(api_name) {
  get_data(`/api/${api_name}/?page_size=${page_size}`, true)
    .then(res => {
      return res.json();
    })
    .then((result) => {
      this.setState({
        next: result.next,
        quizzes: result.results || []
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
}

function fetchMore(completed) {
  if (this.state.next == null) {
    completed();
    return;
  }
  get_data(this.state.next.replace(Config.serverUrl, ''), true).then(res => res.json()).then(result => {
    var newData = Object.assign([], this.state.quizzes);
    newData.push.apply(newData, result.results);
    completed();
    this.setState({
      quizzes: newData,
      next: result.next
    })
  });
}

class TopQuizzes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      next: null,
      quizzes : [],
    }
  }

  componentDidMount() {
    fetchData.apply(this, ['top_quiz'])
  }

  handleScrollToBottom(completed) {
    fetchMore.apply(this, [completed])
  }

  render() {
    return (
     <TableView
        ref="top_quizzes"
        dataSource={this.state.quizzes}
        onScrollToBottom={this.handleScrollToBottom.bind(this)}
      /> 
    )
  }
}

class RecentQuizzes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      next: null,
      quizzes : [],
    }
  }

  componentDidMount() {
    fetchData.apply(this, ['recent_quiz'])
  }

  handleScrollToBottom(completed) {
    fetchMore.apply(this, [completed])
  }

  render() {
    return (
     <TableView
        ref="recent_quizzes"
        dataSource={this.state.quizzes}
        onScrollToBottom={this.handleScrollToBottom.bind(this)}
      /> 
    )
  }

}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_type: "Recent quizzes"
    }
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
                  <a className="dropdown-toggle toTitle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{fontSize : "24px", cursor: 'pointer'}}> {this.state.list_type} </a>
                  <div className="dropdown-menu" style = {{cursor: 'pointer'}}>
                    <a className="dropdown-item" onClick={this.handleChangeListType.bind(this)}>Recent quizzes</a>
                    <a className="dropdown-item" onClick={this.handleChangeListType.bind(this)}>Top quizzes</a>
                  </div>
                </div>
              </div>
              <div key={this.state.new_load}>
              {
                this.state.list_type == "Recent quizzes" 
                ? <RecentQuizzes/>
                : <TopQuizzes/>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;