import React, { Component } from 'react';
import { CATEGORY_FROM_CODE } from './Constants';
import get_data from './Utils';

class ScoreAlert extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="modal fade" ref='scoreModal' id="quizScoreModal" tabIndex="-1" role="dialog" aria-labelledby="quizResultModalTitle" aria-hidden="true">
          <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              {this.props.result}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


class QuizResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qresult: 0
    }
  }

  submitQuiz() {
    const indices = this.props.questions.map((x) => x.index);
    const answers = indices.map((x) => ({ index: x, answer: this.props.submission[x]}));
    return {
      quiz_id: this.props.quizId,
      answers: answers,
    };
  }

  handleOnClick(data) {
    fetch('/api/submit_quiz/' , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Score: ", data);
      this.setState({
        qresult: data.mark
      })
      // this.refs.scoreModal.modal('show');
      alert("Your score is: " + data.mark + " pts");
    }).catch(err => {
      console.log(err);
      alert("You cannot answer this because you have already answerd or you are the author");
    });
    this.refs.submit.click();
  }

  render() {
    // console.log(this.props.questions);
    return (
      <div>
      <button type="button" className="btn btn-warning float-right" data-toggle="modal" data-target="#quizResultModal">
        Submit
      </button>
      <ScoreAlert result={this.state.qresult}/>
      <div className="modal fade" id="quizResultModal" tabIndex="-1" role="dialog" aria-labelledby="quizResultModalTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/*
            <div className="modal-header">
              <h5 className="modal-title" id="quizResultModalTitle">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            */}
            <div className="modal-body">
              Are you sure ?
            </div>
            <div className="modal-footer">
              <button type="button" ref="submit" className="btn btn-secondary" data-dismiss="modal">Nope</button>
              <button type="button" className="btn btn-primary" onClick={event => this.handleOnClick(this.submitQuiz())}>Yes, sumbit</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default QuizResult;
