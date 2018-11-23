import React, { Component } from 'react';
import QuizItem from "./QuizItem"
import { CODE_CATEGORY } from './Constants';

function get_quizzes_cate(cate, num_page, quiz_per_page) {
  /* TODO: get quizzes regraded with API */
  const quiz_cate_list = [
    {
      title: "Quiz 1",
      description: "Brief description 1 here...",
      category: CODE_CATEGORY[cate],
      rated: 3
    },
    {
      title: "Quiz 2",
      description: "Brief description 2 here...",
      category: CODE_CATEGORY[cate],
      rated: 2
    },
    {
      title: "Quiz 3",
      description: "Brief description 3 here...",
      category: CODE_CATEGORY[cate],
      rated: 1
    },
    {
      title: "Quiz 4",
      description: "Brief description 4 here...",
      category: CODE_CATEGORY[cate],
      rated: 3
    },
    {
      title: "Quiz 5",
      description: "Brief description 5 here...",
      category: CODE_CATEGORY[cate],
      rated: 2
    },
    {
      title: "Quiz 6",
      description: "Brief description 6 here...",
      category: CODE_CATEGORY[cate],
      rated: 1
    }
  ];
  return quiz_cate_list;
}

class QuizCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz_cate_list : []
    }
  }

  componentDidMount() {
    this.setState({
      quiz_cate_list : get_quizzes_cate(this.props.match.params.cate, 1, 6)
    })
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
            <div className="category-name"> {CODE_CATEGORY[this.props.match.params.cate]} </div>
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