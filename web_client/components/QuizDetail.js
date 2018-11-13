import React, { Component } from "react";
import {Link} from 'react-router-dom';

class QuizDetail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container" id="quiz-page">
                <div className="row">
                    <div className="col-lg-3" id="left-body">
                        <div className="text-center">
                            <img id="quiz-category" src={"/static/quizzes/images/tsc.png"}/>
                        </div>
                        <h1 className="text-center">Math</h1>
                    </div>
                    <div className="col-lg-6" id="main-body">
                        <div className="row">
                            <div className="col-sm-6">
                                <h2>QUIZ TITLE</h2>
                            </div>
                            <div className="col-sm-6">
                                <a className="btn btn-outline-secondary float-right" id="drop-btn" href="#">
                                    <span>Drop here to submit</span>
                                </a>
                            </div>
                        </div>
                        <br/>
                        <div className="text-center">
                            <img src={"/static/quizzes/images/cat.png"} className="rounded-circle avatar align-middle"/>
                        </div>
                        <br/>
                        <br/>
                        <p>Description here. Something is long enought to make this look beautiful</p>
                    </div>
                    <div className="col-lg-3" id="right-body">
                        <p class="font-weight-bold">And your answer is:</p>
                        <ul id="answer-list">
                            <li className="btn btn-info">One</li>
                            <br/>
                            <li className="btn btn-info">Two</li>
                            <br/>
                            <li className="btn btn-info">Three</li>
                        </ul>
                        <br/>
                        <a className="btn btn-outline-info" href="#">Solution</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuizDetail;