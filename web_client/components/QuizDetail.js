import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Pagination from "react-paginating";
import QuestDetail from "./QuestDetail";
import QuizResult from "./QuizResult";
import { CATEGORY_FROM_CODE, CATEGORY_IMG } from './Constants';
import get_data from './Utils';

const limit = 1;
const pageCount = 10;

class QuizDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 1,
      currentPage: 1,
      dataQuiz: {
        title: null,
        brief: null,
        category: null,
        questions: []
      },
      like_count : 0,
      liked : false,
      isFinished : false,
      doQuiz : {}
    };
  }

  handleQuestAnswered = (questAnswered) => {
    this.setState({
      doQuiz: {...this.state.doQuiz, ...questAnswered}
    });
  }

  fetchQuizData() {
    get_data(`/api/quiz_question/${this.props.match.params.quizid}/`, true)
      .then(res => res.json())
      .then(data => {
        if(data.detail) {
          console.log(data.detail);
          get_data(`/api/quiz_result/${this.props.match.params.quizid}/`, true)
            .then(resj => resj.json())
            .then(dataj => {
              let newDataQuiz = dataj;
              newDataQuiz['questions'] = newDataQuiz['answers'];
              let newDoQuiz = {};
              for (var i in newDataQuiz['questions']) 
                newDoQuiz[newDataQuiz['questions'][i].index] = newDataQuiz['questions'][i].user_answer
              console.log(newDataQuiz);
              this.setState({
                total: dataj.answers.length,
                dataQuiz: newDataQuiz,
                like_count : newDataQuiz.like_count,
                liked : newDataQuiz.liked,
                currentPage: 1,
                isFinished: true,
                doQuiz: newDoQuiz
              })
            })
        } else {
          this.setState({
            total: data.questions.length,
            dataQuiz: data,
            like_count : data.like_count,
            liked : data.liked,
            isFinished: false,
            currentPage: 1,
            doQuiz : {}
          });
        }  
      })
      .catch(err => {
        // console.log(err);
      })
  }

  componentDidMount() {
    this.fetchQuizData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.quizid != this.props.match.params.quizid) {
      this.fetchQuizData();
    }
  }

  handleReload() {
    this.fetchQuizData();
  }

  handleLove() {
    fetch(`/api/like_quiz/${this.props.match.params.quizid}/` , {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({
        like_count: data.like_count,
        liked: data.liked
      })

    }).catch(err => {
      console.log(err);
    });
  }

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  getNumberOfCorrect(quests) {
    let total = quests.length;
    let correct = quests.reduce((total, x) => total + x);
    return `${correct} / ${total}`;
  }

  renderRating() {
    var rate = [];
    for(var i = 0; i < 3; i++)
      rate.push(<span key={i} className={i < this.state.dataQuiz.rating ? "fa fa-star checked" : "fa fa-star"}></span>)
    return rate;
  }

  render() {
    const ques = this.state.dataQuiz.questions.map((x) =>  
      <QuestDetail 
        viewOnly={this.state.isFinished} 
        approvalOnly={false} 
        quest_detail={x} 
        callbackQuiz={this.handleQuestAnswered}
        doQuiz={this.state.doQuiz}/>);
    const quests = this.state.dataQuiz.questions.map((x) => (x.correct ? 1 : 0));
    return (
      <div className="container" id="quiz-page">
        <div className="row">
          <div className="col-sm-6">
            <h2>
              
              <i 
                className="fas fa-heart" 
                style={{
                  borderRadius: "10px",
                  border: "1px solid #c3c3c3",
                  padding: "10px 10px",
                  backgroundColor: "#fff", 
                  marginRight: "20px", 
                  fontSize: "20px", 
                  cursor: 'pointer',
                  color : this.state.liked ? "#e2b5b5" : "black"}}
                onClick={e => this.handleLove()}>  {this.state.like_count}
              </i>
              {this.state.dataQuiz.title}
              { 
                localStorage.username == this.state.dataQuiz.author &&
                <Link 
                  style={{marginLeft: "20px", fontSize: "15px"}}
                  to={"/editquiz/" + this.props.match.params.quizid}> 
                  Edit 
                </Link> 
              } 
            </h2>         
            
            <div className='row'>
              <div className='col-sm-2'>
                {this.renderRating()}
              </div>
              <div className='col-sm-10' style={{padding: '0px'}}>
                {this.state.dataQuiz.brief}
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            {
              this.state.isFinished ?
              <div className="float-right scoreboard">
                Correct answer: {this.getNumberOfCorrect(quests)}<br/>
                Point : {this.state.dataQuiz.rating * this.state.dataQuiz.mark}
              </div>
              : <QuizResult 
                submission={this.state.doQuiz} 
                quizId={this.props.match.params.quizid} 
                questions={this.state.dataQuiz.questions}
                callbackReload={this.handleReload.bind(this)}/>
            }
          </div>
        </div>
        <div className="row quest-wrapper">
            <div className="col-sm-2 left-body">
              <div className="quest-category">
                <p className="text-center"> {CATEGORY_FROM_CODE[this.state.dataQuiz.category]}</p>
                <div className="text-center">
                    <img id="quiz-category" src={CATEGORY_IMG[this.state.dataQuiz.category]}/>
                </div>
              </div>
            </div>
            <div className="col-sm-10" >
              <Pagination
                total={this.state.total}
                limit={limit}
                pageCount={pageCount}
                currentPage={this.state.currentPage}
              >
                {({
                  pages,
                  currentPage,
                  hasNextPage,
                  hasPreviousPage,
                  previousPage,
                  nextPage,
                  totalPages,
                  getPageItemProps
                }) => (
                  <div id="ques_detail">
                    
                    <button
                      {...getPageItemProps({
                        pageValue: previousPage,
                        onPageChange: this.handlePageChange
                      })}
                      disabled={hasPreviousPage ? false : true}
                    >
                      {"Prev"}
                    </button>
                    

                    {pages.map(page => {
                      let activePage = null;
                      if (this.state.currentPage === page) {
                        activePage = { backgroundColor: "#A15959", color: '#fbfbfb' };
                      }
                      return (
                        <button
                          key={page}
                          style={activePage}
                          {...getPageItemProps({
                            pageValue: page,
                            onPageChange: this.handlePageChange
                          })}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      {...getPageItemProps({
                        pageValue: nextPage,
                        onPageChange: this.handlePageChange
                      })}
                      disabled={hasNextPage ? false : true}
                    >
                      {"Next"}
                    </button>

                  </div>
                )}
              </Pagination>
              {ques[this.state.currentPage-1]}      
            </div>
        </div>
      </div>
    );
  }
}

export default QuizDetail;
