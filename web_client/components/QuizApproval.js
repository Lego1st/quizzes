import React, { Component } from "react";
import QuestDetail from './QuestDetail';
import { Link } from 'react-router-dom';
import get_data from './Utils';
import {CATEGORY_FROM_CODE} from './Constants';

class QuizApproval extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            quiz_pending_list: []
        }
    }

    componentDidMount() {
        get_data('/api/pending_quiz/', true)
            .then(res => res.json())
            .then(result => {
                // console.log(result);
                this.setState({
                    quiz_pending_list: result,
                    selected: result.length > 0 ? result[0] : null
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    onSelectQuiz(quiz) {
        let selected_quiz = this.state.quiz_pending_list.filter(q => quiz.id == q.id);
        this.setState({selected: selected_quiz[0]});
    }

    handleUpdate(status) {
        get_data(`/api/quiz_status_update/${this.state.selected.id}/`, true, 'PUT', {'status': status})
            .then(res => res.json())
            .then(result => {
                let new_list = this.state.quiz_pending_list.map(q => {
                    if (q.id == this.state.selected.id) {
                        q.status = status;
                        return q;
                    } else {
                        return q;
                    }
                });
                let new_selected = this.state.selected;
                new_selected.status = status;
                this.setState({
                    quiz_pending_list: new_list,
                    selected: new_selected
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    renderQuizList(quiz_list) {
        let quizzes = [];
        for (let i = 0; i < quiz_list.length; i++) {
            quizzes.push(<div key={quiz_list[i].id} className={"qz_quiz_item" + 
                    (this.state.selected.id == quiz_list[i].id ? " selected_quiz" : "")}
                    onClick={() => {this.onSelectQuiz(quiz_list[i])}}>
                <div className="qz_quiz_title">{quiz_list[i].title}</div>
                <div className="qz_quiz_desc" style={{ textOverflow: "ellipsis", "whiteSpace": "nowrap" }}>{
                    quiz_list[i].brief}</div>
                <div className="row">
                    <div className="col-sm-6">
                        Created by: &nbsp;
                        <Link to={`/profile`}>
                            <span className="qz_quiz_author">{quiz_list[i].author}</span>
                        </Link>
                    </div>
                    <div className="col-sm-6">
                        <Link to={`/category/${quiz_list[i].category}`} style={{ "float": "right" }}>
                            <div className="qz_quiz_cate">{CATEGORY_FROM_CODE[quiz_list[i].category]}</div>
                        </Link>
                    </div>
                </div>

            </div>)
        }
        return quizzes;
    }

    renderQuestionList(questions) {
        return questions.map(question => {
            return <QuestDetail key={question.index} quest_detail={question} viewOnly={true}
                                doQuiz={{}} callbackQuiz={() => {}}/>
        });
    }

    render() {
        let selected = this.state.selected;
        return (
            <div className="container" id="qz_quiz_approval">
                <div id="qz_pending_list" style={{ height: "initial", width: "550px" }}>
                    {this.renderQuizList(this.state.quiz_pending_list)}
                </div>
                <div id="qz_detail_quiz">
                    {selected ? 
                        <div>
                            <div className="qz_detail_title">{selected.title}</div>
                            <div className="qz_detail_desc">{selected.brief}</div>
                            <div className="row">
                                <div className="col-sm-6">
                                    Created by: &nbsp;
                                    <Link to={`/profile`}>
                                        <span className="qz_quiz_author">{selected.author}</span>
                                    </Link>
                                </div>
                                <div className="col-sm-6">
                                    <Link to={`/category/${selected.category}`} style={{ "float": "right" }}>
                                        <div className="qz_quiz_cate">{CATEGORY_FROM_CODE[selected.category]}</div>
                                    </Link>
                                </div>
                            </div>
                            <div className="qz_detail_group_button">
                                <button className="btn qz_approval_button btn-success"
                                        onClick={() => {this.handleUpdate('a')}}
                                        disabled={selected.status=='a'}>Approve</button>
                                <button className="btn qz_approval_button btn-danger"
                                        onClick={() => {this.handleUpdate('r')}}
                                        disabled={selected.status=='r'}>Reject</button>
                            </div>
                            <div>
                                {this.renderQuestionList(selected.questions)}
                            </div>
                        </div>
                        :
                        null
                    }
                </div>
            </div>
        );
    }
}

export default QuizApproval;