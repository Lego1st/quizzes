import React, { Component } from 'react';
import QuizItem from "./QuizItem"

class QuizCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz_cate_list : [
        {
          title: "Quiz 1",
          description: "Brief description 1 here...",
          category: "Animal",
          rated: 3
        },
        {
          title: "Quiz 2",
          description: "Brief description 2 here...",
          category: "Animal",
          rated: 2
        },
        {
          title: "Quiz 3",
          description: "Brief description 3 here...",
          category: "Animal",
          rated: 1
        },
        {
          title: "Quiz 4",
          description: "Brief description 4 here...",
          category: "Animal",
          rated: 3
        },
        {
          title: "Quiz 5",
          description: "Brief description 5 here...",
          category: "Animal",
          rated: 2
        },
        {
          title: "Quiz 6",
          description: "Brief description 6 here...",
          category: "Animal",
          rated: 1
        },
      ]
    }
  }

  renderQuizList() {
    var quizzes = [];
    for (var i = 0; i < this.state.quiz_cate_list.length; i++) {
      quizzes.push(<QuizItem key={i} info={this.state.quiz_cate_list[i]}/>)
    }
    return quizzes;
  }

  render() {
    return (
      <div className="container" id="quizzes-page">
        <div className="row">

          <div className="col-sm-3" id="left-body">
            <img id="quizzes-category" src={"/static/quizzes/images/animal.png"}/>
          </div>

          <div className="col-sm-6" id="main-body">

            <div id="qz_pending_list">
              {this.renderQuizList()}
            </div>
          </div>
          <div className="col-sm-3" id="right-body"></div>
        </div>
      </div>
    );
  }
}

export default QuizCategory;