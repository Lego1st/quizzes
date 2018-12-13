import React, { Component } from 'react';
import get_data from './Utils';
import TableView from './TableView';

var Config = require('Config');
const page_size = 5;

function fetchData() {
  get_data(`/api/search/?search=${this.props.match.params.search_text}&page_size=${page_size}`, true)
    .then(res => {
      return res.json();
    })
    .then((result) => {
      this.setState({
        next: result.next,
        quizzes: result.results || []
      })
    },
      (error) => {
        console.log(error);
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
}

function fetchMore(completed) {
  if (this.state.next == null) {
    completed();
    return;
  }
  get_data(this.state.next.replace(Config.serverUrl, ''), true).then(res => res.json()).then(result => {
    var newData = Object.assign([], this.state.quizzes);
    newData.push.apply(newData, result.results);
    completed();
    this.setState({
      quizzes: newData,
      next: result.next
    })
  });
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
        next: null,
        quizzes : [],
      }
  }

  componentDidMount() {
      fetchData.apply(this);
  }

  handleScrollToBottom(completed) {
    fetchMore.apply(this, [completed])
  }

  render() {
    return (
        <div className="container" id="home-page">
            <div className="row">
                <div className="col-sm-1" id="left-body"></div>
                <div className="col-sm-10" id="main-body" style={{padding: "0 10px 20px 15px"}}>
                    <div id="qz_pending_list" style={{padding: "20px", height: "auto"}}>
                        <div className="qz_list_title" style={{fontSize: '20px', 'margin': '0 0 20px 0'}}>
                            Search result for:  <span style={{textDecoration: "underline"}}>{this.props.match.params.search_text}</span>
                        </div>
                        {
                            (this.state.quizzes.length == 0) ? (
                                <div style={{'textAlign': 'center'}}>No result found!</div>
                            ) : (
                                <TableView
                                    dataSource={this.state.quizzes}
                                    onScrollToBottom={this.handleScrollToBottom.bind(this)}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Search;
