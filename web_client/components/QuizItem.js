import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {CATEGORY_FROM_CODE} from './Constants';

class QuizItem extends Component {
  constructor(props) {
    super(props);
  }

  renderRating() {
    var rate = [];
    for(var i = 0; i < this.props.info.rating; i++)
      rate.push(<span key={i} className="qz_rating"></span>)
    return rate;
  }

  render() {
    return (
      <div className="qz_quiz_item">
        <Link to="/quiz/1997">
          <div className="qz_quiz_title">{this.props.info.title}</div>
          <div className="qz_quiz_desc" style={{textOverflow: "ellipsis", "whiteSpace": "nowrap"}}>{
            this.props.info.brief}</div>
          <div className="qz_quiz_rating">
            {this.renderRating()}
          </div>
          <div className="qz_quiz_cate">{CATEGORY_FROM_CODE[this.props.info.category]}</div>
        </Link>
      </div>  
    );
  }
}

export default QuizItem;