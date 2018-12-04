import React, { Component } from 'react';
import { CATEGORY_FROM_CODE, QUIZRESULTHAT, RUSURE } from './Constants';
import get_data from './Utils';
import { Link } from 'react-router-dom';

class QuizResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qresult: 'Are you sure ?',
      tflist: [],
      isSubmited: false
    }
  }

  getNumberOfCorrect(quests) {
    let total = quests.length;
    let correct = quests.reduce((total, x) => total + x);
    return `${correct} / ${total}`;
  }


  submitQuiz() {
    const indices = this.props.questions.map((x) => x.index);
    const answers = indices.map((x) => ({ index: x, answer: this.props.submission[x]}));
    return {
      quiz_id: this.props.quizId,
      answers: answers
    };
  }

  handleNextQuiz() {
    this.refs.submit.click();
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
      let TFanswers = data.answers.map((x) => (x.correct ? 1 : 0));
      this.setState({
        qresult: "Correct: " + this.getNumberOfCorrect(TFanswers),
        tflist: TFanswers,
        isSubmited: true
      })
      // this.refs.scoreModal.modal('show');

    }).catch(err => {
      console.log(err);
      // this.setState({
      //   qresult: "You cannot answer this because you have already answerd or you are the author",
      //   isSubmited: true
      // })
      // alert("You cannot answer this because you have already answerd or you are the author");
    });
    // this.refs.submit.click();
  }

  render() {
    // console.log(this.props.questions);
    return (
      <div>
      <button type="button" className="btn btn-warning float-right" data-toggle="modal" data-target="#quizResultModal">
        Submit Quiz
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
              {
                this.state.isSubmited 
                ? <div>
                    <img className="center" src={QUIZRESULTHAT}/>
                    <ul style={{"listStyleType" : "none"}}>
                      {this.state.tflist.map((x, idx) => <li> Question {idx}: {x ? <i class="fas fa-check"></i> : <i class="fas fa-times"></i>} </li>)}
                    </ul>
                    <div style={{color: "blue"}}> {this.state.qresult} </div>
                  </div>
                : <img className="center" src={RUSURE}/>
              }
            </div>
            <div className="modal-footer">
              <button type="button" ref="submit" className="btn btn-secondary" data-dismiss="modal">Nope</button>
                {
                  !this.state.isSubmited 
                  ? <button type="button" className="btn btn-primary" onClick={event => this.handleOnClick(this.submitQuiz())}>Yes, sumbit</button>
                  : <Link to="/" onClick={event => this.handleNextQuiz()}>A new quiz ?</Link>
                }
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default QuizResult;
