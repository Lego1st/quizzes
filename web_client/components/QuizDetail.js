import React, { Component } from 'react';
// import { render } from "react-dom";
import Pagination from "react-paginating";
import QuestDetail from "./QuestDetail";
import QuizResult from "./QuizResult";
import { CATEGORY_FROM_CODE } from './Constants';
import get_data from './Utils';

const limit = 1;
const pageCount = 5;

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
      doQuiz : {}
    };
  }

  handleQuestAnswered = (questAnswered) => {
    this.setState({
      doQuiz: {...this.state.doQuiz, ...questAnswered}
    });
  }

  componentDidMount() {
    get_data(`/api/quiz_question/${this.props.match.params.quizid}/`, true)
      .then(res => res.json())
      .then(data => {
        this.setState({
          total: data.questions.length,
          dataQuiz: data
        });  
      })
      .catch(err => {
        console.log(err);
      })
  }

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  render() {
    // const { currentPage } = this.state;
    const ques = this.state.dataQuiz.questions.map((x) =>  <QuestDetail quest_detail={x} callbackQuiz={this.handleQuestAnswered} doQuiz={this.state.doQuiz}/>)
    return (
      <div className="container" id="quiz-page">
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
              {hasPreviousPage && (
                <button
                  {...getPageItemProps({
                    pageValue: previousPage,
                    onPageChange: this.handlePageChange
                  })}
                >
                  {"<"}
                </button>
              )}

              {pages.map(page => {
                let activePage = null;
                if (this.state.currentPage === page) {
                  activePage = { backgroundColor: "#fdce09" };
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

              {hasNextPage && (
                <button
                  {...getPageItemProps({
                    pageValue: nextPage,
                    onPageChange: this.handlePageChange
                  })}
                >
                  {">"}
                </button>
              )}
            </div>
          )}
        </Pagination>
          <div className="row">
            <div className="col-sm-6">
              <h2>{this.state.dataQuiz.title}</h2>
              <p>{this.state.dataQuiz.brief} </p>
            </div>
            <div className="col-sm-6">
              <QuizResult 
                submission={this.state.doQuiz} 
                quizId={this.props.match.params.quizid} 
                questions={this.state.dataQuiz.questions}/>
            </div>
          </div>
          <div className="row">
              <div className="col-lg-3" >
                  <div className="text-center">
                      <img id="quiz-category" src={"/static/quizzes/images/tsc.png"}/>
                  </div>
                  <h1 className="text-center"> {CATEGORY_FROM_CODE[this.state.dataQuiz.category]}</h1>
              </div>
              <div className="col-lg-9" >
                {ques[this.state.currentPage-1]}
              </div>
          </div>
      </div>
    );
  }
}

export default QuizDetail;
