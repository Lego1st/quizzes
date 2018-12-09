import React, { Component } from 'react';
import get_data from './Utils';
import QuizItem from './QuizItem';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
        search_result: []
    }
  }

  componentDidMount() {
      get_data(`/api/search/${this.props.match.params.search_text}/`, true)
        .then(res => res.json())
        .then(result => {
            // console.log(result);
            let quizzes = result ? result.map(e => {
                return {
                    id: e.quiz_id,
                    brief: e.quiz_brief,
                    rating: e.quiz_rating,
                    status: e.quiz_status,
                    title: e.quiz_title,
                    category: e.quiz_category
                }
            }) : [];
            this.setState({
                search_result: quizzes
            })
        }) 
        .catch(err => {
            console.log(err);
        });
  }

  renderQuizList(quiz_list) {
    var quizzes = [];
    for (var i = 0; i < quiz_list.length; i++) {
      quizzes.push(<QuizItem key={i} info={quiz_list[i]} />)
    }
    if (quizzes.length == 0) {
        return <div style={{'textAlign': 'center'}}>No result found!</div>
    }
    return quizzes;
  }

  render() {
    return (
        <div className="container" id="home-page">
            <div className="row">
                <div className="col-sm-1" id="left-body"></div>
                <div className="col-sm-10" id="main-body" style={{padding: "0 10px 20px 15px"}}>
                    <div id="qz_pending_list" style={{padding: "20px", height: "auto"}}>
                        <div className="qz_list_title" style={{fontSize: '32px', 'margin': '0 0 64px 0'}}>
                            Search result for:  <span style={{textDecoration: "underline"}}>{this.props.match.params.search_text}</span>
                        </div>
                        {this.renderQuizList(this.state.search_result)}
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Search;
