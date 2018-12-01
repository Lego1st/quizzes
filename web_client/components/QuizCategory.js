import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TableView from './TableView';
import { CATEGORY_FROM_CODE, CATEGORY_COLOR } from './Constants';
import get_data from './Utils';

var Config = require('Config');
const page_size = 5


class QuizCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      next: null,
      quiz_cate_list : []
    }
  }

  fetchQuizList() {
    get_data(`/api/quiz_category/${this.props.match.params.cate}/?page_size=${page_size}&page=1`, true)
      .then(res => res.json())
      .then(result => {
        // console.log(result)
        this.setState({
          next: result.next,
          quiz_cate_list : result.results || []
        });
      })
      .catch(err => {
        console.log(err);
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
    console.log(this.state.next);
    if(this.state.next == null) {
      completed();
      return;
    }
    get_data(this.state.next.replace(Config.serverUrl, ''), true).then(res => res.json()).then(result=> {
      var newData = Object.assign([], this.state.quiz_cate_list);
      newData.push.apply(newData, result.results);
      completed();
      this.setState({
        quiz_cate_list: newData,
        next: result.next
      })
    });
  }

  render() {
    
    return (
      <div className="container" id="quizzes-page">
        <div className="row">

          <div className="col-sm-2 left-body">
            <div className="category-name" style={{"color" : CATEGORY_COLOR[this.props.match.params.cate]}}> {CATEGORY_FROM_CODE[this.props.match.params.cate]} </div>
          </div>

          <div className="col-sm-9" id="main-body">
            <TableView
              ref="qz_pending_list" 
              dataSource={this.state.quiz_cate_list}
              onScrollToBottom={this.handleScrollToBottom.bind(this)}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default QuizCategory;