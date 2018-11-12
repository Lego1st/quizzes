import React, { Component } from 'react';
import QuizItem from "./QuizItem"
import {Link} from 'react-router-dom';

function Board(props) {
  var display_user_list = [];
  var user_list = getTopUserByCategoryAPI(props.category);
  for (var i = 0; i < user_list.length; i++)
    display_user_list.push(<li>{user_list[i]}</li>)
  return (
    <div className="board">
      <div className="board-title"> {props.category} </div>
      <ul>
        {display_user_list}
      </ul>
    </div>
  )
}

class LeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category : [
        'Animal', 'Math', 'Color', 'Shape', 'Kid', 'Math', 'Computer'
      ]
    }
  }


  render() {
    var boards = []
    var board_row = []
    for (var i = 0; i < this.state.category.length; i++) {
      board_row.push(<Board category={this.state.category[i]}/>)
      if (board_row.length == 3) {
        boards.push(<div className="boards-row">{board_row}</div>)
        board_row = []
      }
    }
    if (board_row.length > 0) {
      boards.push(<div className="boards-row">{board_row}</div>)
    }

    return (
      <div className="container" id="lb-page">
          <div id="leaderboard" > Leaderboard </div>
          <div id="boards">  
            {boards}
          </div>

        </div>      
    );
  }
}

export default LeaderBoard;

function getTopUserByCategoryAPI(category) {
  return ['username1', 'username2', 'username3', 'username4'];
}