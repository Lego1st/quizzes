import React, { Component } from 'react';
import QuizItem from "./QuizItem"
import { Link } from 'react-router-dom';
import get_data from './Utils';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz_pending_list: [
        {
          title: "Get started wit Quizzes",
          description: "Brief description 1 here...",
          category: "Test_Category",
          rated: 3
        },
        {
          title: "How Quizzes rank you ?",
          description: "Brief description 2 here...",
          category: "Test_Category",
          rated: 2
        }
      ],
      top_quiz_list: [
        {
          title: "Quiz 1",
          description: "Brief description 1 here...",
          category: "Math",
          rated: 3
        },
        {
          title: "Quiz 2",
          description: "Brief description 2 here...",
          category: "Kid",
          rated: 2
        },
        {
          title: "Quiz 3",
          description: "Brief description 3 here...",
          category: "Fun",
          rated: 1
        }
      ]
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
    console.log(localStorage.getItem('token'));
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

          <div className="col-sm-6" id="main-body">

            <div id="qz_pending_list">
              <div className="qz_list_title">
                Quiz for you
              </div>
              {this.renderQuizList(this.state.quiz_pending_list)}

            </div>

            <div id="qz_pending_list">
              <div className="qz_list_title">
                Top quiz
              </div>
              {this.renderQuizList(this.state.top_quiz_list)}
            </div>

          </div>
          <div className="col-sm-3" id="right-body"></div>
        </div>
      </div>
    );
  }
}

export default Home;