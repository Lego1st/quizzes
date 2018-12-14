import React, { Component } from 'react';
import QuizItem from "./QuizItem"
import { Link } from 'react-router-dom';
import get_data from './Utils';
import { CATEGORY_FROM_CODE } from './Constants';

function Board(props) {
  let display_user_list = [];
  let user_list = props.user_list;
  for (let i = 0; i < user_list.length; i++) {
    let style = {};
    if (i == 0) {
      style = { 'color': '#ffc425' }
    } else if (i == 1) {
      style = { 'color': '#bcbcbc' }
    } else if (i == 2) {
      style = { 'color': '#c68642' }
    } else {
      style = { 'color': 'white' }
    }
    style.fontSize = '18px';
    display_user_list.push(
      <li key={i} style={{ 'display': 'flex' }}>
        <i className="fas fa-trophy" style={style} />
        <Link to={"/profile/" + user_list[i][0]} style={{ 'flex': '1', 'paddingLeft': '20px' }}>{user_list[i][0]}</Link>
        <span style={{ width: '40px', overflow: 'hidden' }}>{user_list[i][1]}</span>
      </li>
    )
  }
  return (
    <div className="board">
      <div className="board-title"> {CATEGORY_FROM_CODE[props.category]} </div>
      <ul>
        {user_list.length == 0 ?
          <span>No submission for this category</span>
          :
          display_user_list
        }
      </ul>
    </div>
  )
}

class LeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leader_board: {},
      contributors: {}
    }
  }

  componentDidMount() {
    get_data('/profile/api/leader_board/', true)
      .then(res => res.json())
      .then(result => {
        this.setState({ leader_board: result });
      })
      .catch(err => {
        console.log(err);
      })
    get_data('/profile/api/contributor/', true)
      .then(res => res.json())
      .then(result => {
        this.setState({ contributors: result });
      })
  }

  renderLeaderboard() {
    let ld = this.state.leader_board;
    return Object.keys(CATEGORY_FROM_CODE).map((key, i) => {
      let ul = (key in ld) ? ld[key] : [];
      return <Board key={i} category={key} user_list={ul} />;
    });
  }
  renderContributor() {
    let cons = this.state.contributors;
    console.log(cons);
    var board = [];
    if (cons.length) {
      for (let i = 0; i < cons.length; i++) {
        let color = "#B48947";
        let style = {};
        if (i == 0) {
          color = "#fbb456";
        } else if (i == 1) {
          color = "#6D7585";
        }


        board.push(
          <div className="board col" key={i}>
            <div className="group-avatar" style={{ borderColor: color }}>
              {i < 2 ? <img src={'/static/quizzes/images/topicon' + (i + 1) + '.png'} className="con-avatar-top" /> : ''}
              <img src={'/static' + cons[i]['avatar']} className="con-avatar" />
            </div>
            <div className="group-info">
              <Link to={"/profile/" + cons[i]['username']} style={{ color: color }}> <b>{cons[i]['username']}</b>
              </Link>
              <p>{cons[i]['num_con'] + ' Quizzes'} </p>
            </div>
          </div>
        )
      }
      for(let i = 0; i < 3 - cons.length; i++){
        board.push(
          <div className="board col" key={i+2}>
            <div className="group-avatar" style={{ borderColor: '#B48947' }}>
              <img src={'/static/quizzes/images/default_avatar.jpg'} className="con-avatar" />
            </div>
            <div className="group-info">
              <p> No more contributor </p>
            </div>
          </div>
        )
      }
    }else{
      board.push(<div className="board col">No one contribute yet !!! </div>)
    }
    return board
  }
  render() {


    return (
      <div className="container" id="lb-page">
        <div id="leaderboard" className='toTitle'> Leaderboard </div>
        {/* <div style={{"textAlign": "center", "paddingTop": "50px"}}>This feature hasn't been supported yet</div> */}
        <div id="boards">
          {this.renderLeaderboard()}
        </div>
        
        {/*<div id="topcontribute" className='toTitle'>Top  3  contributors </div>
        
        <div id="boardsCon" className="row">
          {this.renderContributor()}
        </div>*/}
      </div>
    );
  }
}

export default LeaderBoard;
