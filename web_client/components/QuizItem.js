import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class QuizItem extends Component {
  constructor(props) {
    super(props);
  }

  renderRating() {
    var rate = [];
    for(var i = 0; i < this.props.info.rated; i++)
      rate.push(<span className="qz_rating"></span>)
    return rate;
  }

  render() {
    return (
      <div className="qz_quiz_item">
        <Link to="/quiz">
          <div className="qz_quiz_title">{this.props.info.title}</div>
          <div className="qz_quiz_desc">{this.props.info.description}</div>
          <div className="qz_quiz_rating">
            {this.renderRating()}
          </div>
          <div className="qz_quiz_cate">{this.props.info.category}</div>
        </Link>
      </div>  
    );
  }
}

export default QuizItem;