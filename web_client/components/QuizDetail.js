import React, { Component } from 'react';
// import { render } from "react-dom";
import Pagination from "react-paginating";

const limit = 1;
const pageCount = 5;


function get_quiz_detail(quiz_id) {
  /* TODO: get quiz regraded with id API */
  return new Promise((resolve, reject) => {
    const ques_list = [...Array(20).keys()].map((x) => 
      ({
        id: x,
        title: "Question " + x,
        statement: "Description here. Something is long enought to make this Question" + x + " look beautiful",
        options: [
          "1st Opt",
          "2nd Opt",
          "3rd Opt"
        ]
      })
    );
    const resJSON = {
      title: "Quiz " + quiz_id,
      description: "Brief description " + quiz_id,
      category: 'Math',      
      ques_list: ques_list
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
        description: null,
        category: null,
        ques_list: []
      }
    };
  }

  componentDidMount() {
    get_quiz_detail(this.props.match.params.quizid).then((data) => {
      this.setState({
        total: data.ques_list.length,
        dataQuiz: data
      });
    })
  }

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  render() {
    // const { currentPage } = this.state;
    const ques = this.state.dataQuiz.ques_list.map((x) => (
      <div key={x.id} className="row">
      <div className="col-lg-8">
        <div className="row">
          <h2>{x.title}</h2>
        </div>
        <br/>
        <div className="text-center">
          <img src={"/static/quizzes/images/cat.png"} className="rounded-circle avatar align-middle"/>
        </div>
        <br/>
        <br/>
        <p>{x.statement}</p>
      </div>
      <div className="col-lg-4">
        <p className="font-weight-bold">And your answer is:</p>
        <ul id="answer-list">
          {x.options.map((y, idx) => (<li key={idx} className="btn btn-info" style={{"display":"block"}}>{y}</li>))}
        </ul>
        
      </div>
      </div>
    ))
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
              <p>{this.state.dataQuiz.description} </p>
            </div>
            <div className="col-sm-6">
              <div className="btn btn-warning float-right"> Submit </div>
            </div>
          </div>
          <div className="row">
              <div className="col-lg-3" >
                  <div className="text-center">
                      <img id="quiz-category" src={"/static/quizzes/images/tsc.png"}/>
                  </div>
                  <h1 className="text-center"> {this.state.dataQuiz.category}</h1>
              </div>
              <div className="col-lg-9" >
                {ques[this.state.currentPage]}
              </div>
          </div>
      </div>
    );
  }
}

export default QuizDetail;
