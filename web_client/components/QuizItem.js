import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {CATEGORY_FROM_CODE, CATEGORY_COLOR} from './Constants';

class QuizItem extends Component {
  constructor(props) {
    super(props);
  }

  renderRating() {
    var rate = [];
    for(var i = 0; i < 3; i++)
      rate.push(<span key={i} className={i < this.props.info.rating ? "fa fa-star checked" : "fa fa-star"}></span>)
    return rate;
  }

  render() {
    return (
      <div className="qz_quiz_item">
        <Link to={`/quiz/${this.props.info.id}`} style={{ textDecoration: 'none' }}>
          <div className="qz_quiz_title">{this.props.info.title}</div>
        </Link>
        <div className="qz_quiz_desc" style={{textOverflow: "ellipsis", "whiteSpace": "nowrap"}}>{
          this.props.info.brief}</div>
        <div className="qz_quiz_rating">
          {this.renderRating()}
        </div>
        <div className="row">
          <div className="col-sm-6"> 
            Created by: 
            <Link to={`/profile/${this.props.info.author}`} style={{ textDecoration : 'none'}}>
              <span className="qz_quiz_author"> {this.props.info.author}</span>
            </Link>
          </div>
          <div className="col-sm-6"> 
            <Link to={`/category/${this.props.info.category}`}  style={{"float" : "right"}}>
              <div className="qz_quiz_cate" style={{"color" : CATEGORY_COLOR[this.props.info.category]}}><b>{CATEGORY_FROM_CODE[this.props.info.category]}</b></div>
            </Link>
          </div>
        </div>
        
      </div>  
    );
  }
}

export default QuizItem;