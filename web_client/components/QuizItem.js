import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {CATEGORY_FROM_CODE, CATEGORY_COLOR} from './Constants';

class QuizItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      like_count: 0,
      liked: false
    }
  }

  componentDidMount() {
    this.setState({
      like_count: this.props.info.like_count,
      liked: this.props.info.liked
    })
  }

  renderRating() {
    var rate = [];
    for(var i = 0; i < 3; i++)
      rate.push(<span key={i} className={i < this.props.info.rating ? "fa fa-star checked" : "fa fa-star"}></span>)
    return rate;
  }

  handleLove() {
    fetch(`/api/like_quiz/${this.props.info.id}/` , {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({
        like_count: data.like_count,
        liked: data.liked
      })

    }).catch(err => {
      console.log(err);
    });
  }

  getCurrentLocation() {
    var currentLocation = window.location.pathname;
    return currentLocation;
  }

  render() {
    return (
      <div className="qz_quiz_item">
        <div className="row">
          <div className="col-sm-6">
            <Link to={`/quiz/${this.props.info.id}`} style={{ textDecoration: 'none' }}>
              <div className="qz_quiz_title">{this.props.info.title}</div>
            </Link>
          </div>
          <div className="col-sm-6">
            <span>
              <i 
                className="fas fa-heart" 
                style={{"float" : "right", "color" : this.state.liked ? "#e2b5b5" : "black"}}
                onClick={e => this.handleLove()}>  {this.state.like_count}
              </i>
            </span>
          </div>
        </div>
        <div className="qz_quiz_desc" style={{textOverflow: "ellipsis"}}>{
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
        {
          this.props.info.status && this.getCurrentLocation().match('/myquizzes/') &&  
          (
            this.props.info.status == "a"
            ? <div style={{color : "green"}}> Approved </div>
            : this.props.info.status == "r"
            ? <div style={{color : "red"}}> Rejected </div>
            : <div style={{color : "gray"}}> Pending </div>
          )
        }
        
      </div>  
    );
  }
}

export default QuizItem;