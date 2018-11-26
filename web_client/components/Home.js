import React, { Component } from 'react';
import QuizItem from "./QuizItem"
import { Link } from 'react-router-dom';
import get_data from './Utils';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    get_data('/profile/current_user/', true)
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          this.props.history.push('/login')
        }
      })
      .then(
        (result) => {
          if(result){
            localStorage.setItem('id', result['id']);
          }
        })
    get_data("/api/recent_quiz/", true)
      .then(res => {
        return res.json();
      })
      .then((result) => {
        console.log(result);
        this.setState({
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


  render() {

    return (
      <div className="container" id="home-page">
        <div className="row">

          <div className="col-sm-3" id="left-body">
            <div id="home-category"> Category </div>
            <ul id="home-cate-list">
              <li><Link to='/category/ma'>Math</Link></li>
              <li><Link to='/category/cs'>Computer Science</Link></li>
              <li><Link to='/category/lg'>Logic</Link></li>
            </ul>
          </div>

          <div className="col-sm-6" id="main-body" style={{padding: "0 10px 20px 15px"}}>

            <div id="qz_pending_list" style={{padding: "20px", height: "auto"}}>
              <div className="qz_list_title">
                Recent quizzes
              </div>
              {this.renderQuizList(this.state.recent_quizzes)}

            </div>

            {/* <div id="qz_pending_list">
              <div className="qz_list_title">
                Top quiz
              </div>
              {this.renderQuizList(this.state.top_quiz_list)}
            </div> */}

          </div>
          <div className="col-sm-3" id="right-body"></div>
        </div>
      </div>
    );
  }
}

export default Home;