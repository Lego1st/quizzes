import React, { Component } from 'react';
// import { render } from "react-dom";
import Pagination from "react-paginating";
import QuestDetail from "./QuestDetail";
import QuizResult from "./QuizResult";
import { CATEGORY_FROM_CODE } from './Constants';
import get_data from './Utils';

const limit = 1;
const pageCount = 5;


function get_quiz_detail(quiz_id) {
  /* TODO: get quiz regraded with id API */
  return new Promise((resolve, reject) => {
    // const ques_list = [...Array(20).keys()].map((x) => 
    //   ({
    //     id: x,
    //     title: "Question " + x,
    //     content: "Description here. Something is long enought to make this Question" + x + " look beautiful",
    //     question_type: Math.floor((Math.random() * 4) + 1),
    //     options: [
    //       "1st Opt",
    //       "2nd Opt",
    //       "3rd Opt"
    //     ]
    //   })
    // );
    // const resJSON = {
    //   title: "Quiz " + quiz_id,
    //   brief: "Brief brief " + quiz_id,
    //   category: 'Math',      
    //   questions: ques_list
    // }

    const resJSON = {
      "id": 3,
      "title": "Third quiz",
      "brief": "This is the third quiz",
      "category": "ma",
      "shuffle": false,
      "questions": [
        {
          "index": 2,
          "type": "fi",
          "content": "3 + 3 = ???",
          "options": []
        },
        {
          "type": "si",
          "index": 1,
          "content": "What is django based on?",
          "options": ["java", "python", "c++", "ruby"]
        },
        {
          "index": 0,
          "type": "ma",
          "content": "Matching this statements",
          "options": ["3", "2", "4"],
          "matchings": ["1+1", "1+2", "1+3"]
        }

      ]
    }
    resolve(resJSON);
  })
}

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
    // get_quiz_detail(this.props.match.params.quizid).then((data) => {
    //   this.setState({
    //     total: data.questions.length,
    //     dataQuiz: data
    //   });
    // })
  }

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  render() {
    // const { currentPage } = this.state;
    const ques = this.state.dataQuiz.questions.map((x) =>  <QuestDetail quest_detail={x} callbackQuiz={this.handleQuestAnswered}/>)
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
