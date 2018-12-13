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
      isSubmited: false,
      next: '/'
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
    this.setState ({
      qresult: 'Are you sure ?',
      tflist: [],
      isSubmited: false,
      next: '/'
    });
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
        isSubmited: true,
        next: (data.next_quiz ? ('/quiz/' + data.next_quiz.toString()) : '/')
      })

    }).catch(err => {
      console.log(err);
    });
  }

  getPreviewAnswered() {
    const indices = this.props.questions.map((x) => x.index);
    const previewAnswers = indices.map((x) => (
      <li key={x}> 
        {this.props.submission[x] && this.props.submission[x].length > 0 ? <span style={{color: "green"}}> Question {x}  </span> : <span style={{color: "red"}}> Question {x} </span>} 
      </li>

    ));
    return previewAnswers;
  }

  handleReload() {
    this.props.callbackReload();
  }

  render() {
    
    return (
      <div>
      <button type="button" className="btn btn-submit-quiz float-right" data-toggle="modal" data-target="#quizResultModal">
        Submit Quiz
      </button>

      <div className="modal fade" id="quizResultModal" tabIndex="-1" role="dialog" aria-labelledby="quizResultModalTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              {
                this.state.isSubmited 
                ? <div>
                    <img className="center" src={QUIZRESULTHAT}/>
                    <ul style={{"listStyleType" : "none", "padding" : "0", "textAlign" : "center"}}>
                      {this.state.tflist.map((x, idx) => <li key={idx}> Question {idx}:    {x ? <i style={{color: "green"}} className="fas fa-check"></i> : <i style={{color: "red"}} className="fas fa-times"></i>} </li>)}
                    </ul>
                  </div>
                : <div>
                    <img className="center" src={RUSURE}/>
                    <ul style={{"listStyleType" : "none", backgroundColor: "#f7f7f7", margin : "20px 70px", padding : "10px 20px", textAlign : "center"}}>
                      <li><span style={{color: "green"}}> Answerded  </span></li>
                      <li><span style={{color: "red"}}> Not answerded </span></li>
                    </ul>
                    <ul style={{listStyleType : "none", padding : "0", textAlign : "center"}}>
                      {this.getPreviewAnswered()}
                    </ul>
                  </div>
              }
            </div>
            <div className="modal-footer">
              {this.state.isSubmited && <div style={{color: "blue"}} className="mr-auto"> {this.state.qresult} </div>}
              {
                !this.state.isSubmited 
                ? (
                  <div>
                    <button type="button" ref="submit" className="btn btn-secondary" data-dismiss="modal">Nope</button>
                    <button type="button" className="btn btn-primary" onClick={event => this.handleOnClick(this.submitQuiz())} style={{marginLeft: "10px"}}>Yes, sumbit</button>
                  </div>
                  )
                : (
                  <div>
                    <Link to={this.state.next} onClick={event => this.handleNextQuiz()}>A new quiz ?</Link>
                    <button type="button" ref="submit" className="btn btn-secondary" data-dismiss="modal" onClick={event => this.handleReload()} style={{marginLeft: "10px"}}>Nope</button>
                  </div>
                  )
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
