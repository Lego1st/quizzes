import React, { Component } from 'react';
import QuizItem from "./QuizItem"
import {Link} from 'react-router-dom';
import get_data from './Utils';
import {CATEGORY_FROM_CODE} from './Constants';

function Board(props) {
  let display_user_list = [];
  let user_list = props.user_list;
  for (let i = 0; i < user_list.length; i++)
    display_user_list.push(<li key={i}>{user_list[i][0]}</li>)
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
      leader_board : {}
    }
  }

  componentDidMount() {
    get_data('/profile/api/leader_board/', true)
      .then(res => res.json())
      .then(result => {
        this.setState({leader_board: result});
      })
      .catch(err => {
        console.log(err);
      })
  }

  renderLeaderboard() {
    let ld = this.state.leader_board;
    return Object.keys(CATEGORY_FROM_CODE).map((key, i) => {
      let ul = (key in ld) ? ld[key] : [];
      return <Board key={i} category={key} user_list={ul}/>;
    });
  }

  render() {
    // let boards = []
    // let board_row = []
    // for (let i = 0; i < this.state.category.length; i++) {
    //   board_row.push(<Board key={i} category={this.state.category[i]} user_list={ld[key]}/>)
    //   if (board_row.length == 3) {
    //     boards.push(<div key={i} className="boards-row">{board_row}</div>)
    //     board_row = []
    //   }
    // }
    // if (board_row.length > 0) {
    //   boards.push(<div key="-1" className="boards-row">{board_row}</div>)
    // }

    return (
      <div className="container" id="lb-page">
          <div id="leaderboard" > Leaderboard </div>
          {/* <div style={{"textAlign": "center", "paddingTop": "50px"}}>This feature hasn't been supported yet</div> */}
          <div id="boards">  
            {this.renderLeaderboard()}
          </div>

        </div>      
    );
  }
}

export default LeaderBoard;
