import React, { Component } from 'react';
import { CATEGORY_FROM_CODE } from './Constants';
import get_data from './Utils';



class QuizResult extends Component {
  constructor(props) {
    super(props);
  }

  submitQuiz() {
    const indices = this.props.questions.map((x) => x.index);
    const answers = indices.map((x) => ({ index: x, answer: this.props.submission[x]}));
    return {
      quiz_id: this.props.quizId,
      answers: answers
    };
  }

  render() {
    // console.log(this.props.questions);
    return (
      <div>
      <button type="button" className="btn btn-warning float-right" data-toggle="modal" data-target="#quizResultModal">
        Submit
      </button>
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
              {JSON.stringify(this.submitQuiz())}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Nope</button>
              <button type="button" className="btn btn-primary">Yes, sumbit</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default QuizResult;
