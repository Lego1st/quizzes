import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
// use default loading spinners
import ReactRefreshInfiniteTableView from '../lib/ReactRefreshInfiniteTableView'
import QuizItem from './QuizItem'

export default class TableView extends ReactRefreshInfiniteTableView {

  constructor(props) {
    super(props)
  }

  render() {
    const quizzes = this.props.dataSource.map((x, idx) => (
      <QuizItem key={idx} info={x}/>
    ));
    return (
      <div id="qz_pending_list" onScroll={this.viewDidScroll}>
        {quizzes.length == 0 ? 
          <div style={{ textAlign: 'center' }}>
            <h3>It looks like we currently do not have any post yet ^^</h3>

            <h4>Click
                <Link to="/addquiz">
                <i className="fas fa-plus-circle" style={{ margin: '1%' }}></i>
              </Link>
              to add one!
                  </h4>
          </div>
          :
          quizzes
        }
      </div>
    )
  }

}