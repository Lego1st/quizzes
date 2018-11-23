import React from 'react'
import ReactDOM from 'react-dom'

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
        {quizzes}
      </div>
    )
  }

}