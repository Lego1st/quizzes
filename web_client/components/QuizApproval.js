import React, { Component } from "react";
import QuizItem from "./QuizItem";
import {Link} from 'react-router-dom';

class QuizApproval extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quiz_pending_list: [
                {
                    title: "Get started wit Quizzes",
                    description: "Brief description 1 here...",
                    category: "Test_Category",
                    rated: 3
                },
                {
                    title: "How Quizzes rank you ?",
                    description: "Brief description 2 here...",
                    category: "Test_Category",
                    rated: 2
                },
                {
                    title: "Quiz 1",
                    description: "Brief description 1 here...",
                    category: "Math",
                    rated: 3
                  },
                  {
                    title: "Quiz 2",
                    description: "Brief description 2 here...",
                    category: "Kid",
                    rated: 2
                  },
                  {
                    title: "Quiz 3",
                    description: "Brief description 3 here...",
                    category: "Fun",
                    rated: 1
                  },
                  {
                    title: "Quiz 4",
                    description: "Brief description 3 here...",
                    category: "Fun",
                    rated: 1
                  },
                  {
                    title: "Quiz 5",
                    description: "Brief description 3 here...",
                    category: "Computer Science",
                    rated: 4
                  },
                  {
                    title: "Quiz 6",
                    description: "Brief description 3 here...",
                    category: "Math",
                    rated: 5
                  }
            ]
        }
    }

    renderQuizList(quiz_list) {
        var quizzes = [];
        for (var i = 0; i < quiz_list.length; i++) {
          quizzes.push(<QuizItem info={quiz_list[i]}/>)
        }
        return quizzes;
    }

    render() {
        return (
            <div className="container" id="qz_quiz_approval">
                <div id="qz_pending_list">
                    {this.renderQuizList(this.state.quiz_pending_list)}
                </div>
                <div id="qz_detail_quiz">
                <div className="qz_detail_title">QUIZ 1</div>
                    <div className="qz_detail_figure"></div>
                    <div className="qz_detail_desc">Description here, something is long enough to make this beautiful</div>
                    <div>And your answer is:</div>
                    <ul>
                        <li>One</li>
                        <li>Two</li>
                        <li>Three</li>
                    </ul>
                    <div className="qz_detail_group_button">
                        <div className="qz_approval_button">OK</div>
                        <div className="qz_approval_button">DEL</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuizApproval;