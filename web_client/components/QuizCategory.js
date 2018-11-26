import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import QuizItem from "./QuizItem";
import TableView from './TableView';
import { CATEGORY_FROM_CODE } from './Constants';

function get_quiz_by_category(cate, num_page) {
  /* TODO: get quizzes regraded with API */
  console.log(cate);
  console.log(num_page);
  return new Promise((resolve, reject) => {
    const quiz_cate_list = [...Array(10).keys()].map((x) => 
      ({
        title: "Quiz " + (x + 10*num_page),
        description: "Brief description " + (x + 10*num_page),
        category: CATEGORY_FROM_CODE[cate],
        rated: Math.floor((Math.random() * 3) + 1)
      })
    );
    resolve(quiz_cate_list);
  })
}

class QuizCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num_page: 0,
      quiz_cate_list : []
    }
    // this.dom = ReactDOM.findDOMNode(this)
  }

  fetchQuizList() {
    get_quiz_by_category(this.props.match.params.cate, 0).then((data) => {
      this.setState({
        num_page: 0,
        quiz_cate_list : data
      })
    })
  }

  componentDidMount() {
    this.fetchQuizList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.cate != this.props.match.params.cate) {
      let tableView = ReactDOM.findDOMNode(this.refs.qz_pending_list);
      tableView.scrollTop = 0;
      this.fetchQuizList();
    }
  }

  handleScrollToBottom(completed) {
    // load more

    // var newData = this.moreData(this.state.quiz_cate_list)
    var new_num_page = this.state.num_page+1;
    get_quiz_by_category(this.props.match.params.cate, new_num_page).then((data) => {
      var newData = Object.assign([], this.state.quiz_cate_list);
      newData.push.apply(newData, data);
      completed();
      this.setState({
        quiz_cate_list: newData,
        num_page: new_num_page
      })
    })
  }

  render() {
    
    return (
      <div className="container" id="quizzes-page">
        <div className="row">

          <div className="col-sm-3" id="left-body">
            <div className="category-name"> {CATEGORY_FROM_CODE[this.props.match.params.cate]} </div>
          </div>

          <div className="col-sm-6" id="main-body">
            <TableView
              ref="qz_pending_list" 
              dataSource={this.state.quiz_cate_list}
              onScrollToBottom={this.handleScrollToBottom.bind(this)}
            />
          </div>
          <div className="col-sm-3" id="right-body"></div>
        </div>
      </div>
    );
  }
}

export default QuizCategory;