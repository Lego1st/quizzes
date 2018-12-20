import React from "react";
import ReactMdeDemo from "./ReactMdeDemo";
import {CODE_CATEGORY} from "./Constants";
import {CATEGORY_CODE} from "./Constants";
import {QUESTION_TYPE} from "./Constants";
import {TYPE_QUESTION} from "./Constants";
import {QUIZ_STATUS} from "./Constants";
import get_data from './Utils'
import QuestHolder from "./QuestHolder";
import Adder from "./QuestAdder";

var Config = require('Config');

class EditQuiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: null,
			title: "",
			brief: "",
			category : "",
			shuffle: false,
			rating : 1,
			questions: [],
		};
		this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
		this.handleAddQuestion = this.handleAddQuestion.bind(this);
		this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
	}

	componentDidMount() {
		console.log(this.props.match.params.quizid);
		get_data("/api/full_quiz/" + this.props.match.params.quizid + "/", true).then((res) => res.json())
			.catch(
				(error) => {
					console.log(error);
				})
			.then(
				(result) => {
					console.log('fetch quiz', result);
					const questions = [];
					for (var i = 0; i < result.questions.length; i++){
						var q = result.questions[i];
						q.type = TYPE_QUESTION[q.type];
						q.answer = q.answer.map((item) => q.options.indexOf(item));
						questions.push(q);
					}
					this.setState(result);
					this.setState({questions : questions})
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					
					console.log(error);
				}
			)
	}

	handleChangeTitle(event) {
		this.setState({title: event.target.value})
	}

	handleChangeBrief(event) {
		this.setState({ brief: event.target.value })	
	}

	handleChangeCategory(event) {
		this.setState({ category: event.currentTarget.textContent })
	}

	handleChangeCategory(event) {
		this.setState({category: event.currentTarget.textContent})
	}

	handleChangeQuestion(_question, index) {
		// console.log(this)
		const new_questions = this.state.questions;
		new_questions[index] = _question;

		this.setState({questions: new_questions});
		console.log("Saving new question: ", this.state.questions);
	}

	handleChangeRating(_rate) {
		this.setState({ rating: _rate});
	}

	handleAddQuestion(_index) {
		const new_questions = this.state.questions;
		new_questions.push({
			index: _index,
			content: 'Edit question ' + new_questions.length,
			type: 0,
			matchings: [],
			options: [],
			answer: []
		})

		this.setState({questions: new_questions});
		console.log(this.state.questions);
	}

	handleDeleteQuestion(order) {
		var new_questions = this.state.questions;
		new_questions[order] = null;
		var filtered = this.state.questions.filter(function (el) {
		  return el != null;
		});

		this.setState({questions: filtered});
		console.log("state questions:", filtered);
	}

	convertState() {
		const converted_state = Object.assign({}, this.state);
		const converted_questions = [];
		for (var i = 0; i < converted_state.questions.length; i++) {
			const question = Object.assign({}, converted_state.questions[i]);
						
			if (question['type'] == 3) {
				question['answer'] = question['options'];
			}
			if (question['type'] < 2) {
				console.log("answer of question " + i, question['answer']);
				question['answer'] = question['answer'].map((item) => question['options'][item]); 
			}
			question['type'] = QUESTION_TYPE[question['type']];
			converted_questions.push(question);
		}

		converted_state.questions = converted_questions;

		return converted_state;
	}

	validateTitle(){
		if (this.state.title.replace(/ /g,'') == '') {
			return false;
		}
		return true;
	}

	validateBrief(){
		if (this.state.brief.replace(/ /g,'') == '') {
			return false;
		}
		return true;
	}

	validateCategory(){
		if (!this.state.category) {
			return false;
		}
		return true;
	}

	handleSubmit(e) {
		if (!this.validateCategory()) {
			$(".submitErrorMesssage").text("Please specify the category.");
			$(".categoryDropdown").click();
			return;
		}

		if (!this.validateTitle()) {
			$(".submitErrorMesssage").text("Please fill in the title.");
			$(".titleInput").focus();
			return;
		}

		if (!this.validateBrief()) {
			$(".submitErrorMesssage").text("Please fill in the brief.");
			$(".briefInput").focus();
			return;
		}

		const converted_state = this.convertState();

		console.log('Final state: ', JSON.stringify(converted_state));
		fetch(Config.serverUrl + '/api/full_quiz/'  + this.props.match.params.quizid + "/", {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + localStorage.getItem('token'),
			},
			body: JSON.stringify(converted_state)
		})
		.then((result) => {
			if (result.ok) {
				console.log(result);	
				window.location.replace(Config.serverUrl + '/myquizzes' + localStorage.getItem('username'));				
			}
			else if (result.status == 403){
				$(".submitErrorMesssage").text('You cannot edit quiz after it is approved!');
			} 
			else {
				console.log(result);	
				$(".submitErrorMesssage").text('Oops! Something went wrong :( Please re-check your form!');
			}
		});
	}

	handleDelete() {
		fetch(Config.serverUrl + '/api/full_quiz/'  + this.props.match.params.quizid + "/", {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + localStorage.getItem('token'),
			},
		})
		.then((result) => {
			if (result.ok) {
				console.log(result);	
				window.location.replace(Config.serverUrl+ '/myquizzes/' + localStorage.getItem('username'));				
			}
			else {
				$(".submitErrorMesssage").text('Oops! Something went wrong :( Please re-check your form!');
			}
		});
	}

	renderRating() {
	    var rate = [];
	    for(var i = 0; i < 3; i++)
	      rate.push(<span key={i} className={i < this.state.rating ? "fa fa-star checked" : "fa fa-star"} 
	      				onClick={this.handleChangeRating.bind(this, i+1)} 
	      				style={{marginLeft: '1%', marginRight: '1%'}}></span>)
	    return rate;
	}

	render() {
		let buttons = [];
		let indices = [];
		for (var i = 0; i < this.state.questions.length; i++) {
			buttons.push( <QuestHolder index = {this.state.questions[i].index}
									order = {i}
									numOptions={Math.max(4, this.state.questions[i].options.length, this.state.questions[i].answer.length)}
									key = {this.state.questions[i].index}
									intial_state = {this.state.questions[i]}
									savingQuestion = {this.handleChangeQuestion}
									handleDeleteQuestion = {this.handleDeleteQuestion}
									brief = {this.state.questions[i].content.substring(0, 20) + '...'}/>)
			indices.push(this.state.questions[i].index);
		}

		buttons.push(<Adder index = {Math.max.apply(null, indices) + 1} 
						order = {buttons.length}
						key = {Math.max.apply(null, indices) + 1} 
						handleChangeQuestion = {this.handleChangeQuestion}
						handleAddQuestion = {this.handleAddQuestion}> </Adder>)

		const categories = Object.keys(CODE_CATEGORY);
		console.log(CODE_CATEGORY);
		const cate_dropdown = [];
		for (var i = 0; i < categories.length; i++) {
			cate_dropdown.push(<a key = {categories[i]} className="dropdown-item" onClick = {this.handleChangeCategory.bind(this)} href="#">{categories[i]}</a>)
		}

		return (
			<div className = 'container' style ={{marginTop: '3%', textAlign: 'center'}}>
				<div className="jumbotron"  style={{ backgroundColor: '#fbfbfb' }}>
					<h1 className="display-4">
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<button className="btn btn-upload dropdown-toggle categoryDropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{CATEGORY_CODE[this.state.category]}</button>
								<div className="dropdown-menu">
									{
										cate_dropdown
									}
									
								</div>
							</div>
							
							<input type="text" className="form-control"
								placeholder={this.state.title}
								value = {this.state.title}
								onChange={this.handleChangeTitle.bind(this)} />
							
						</div>
					</h1>

					<h1 className="display-4">
						<div className="input-group mb-3">
							<div className="input-group-append ">
								{/*<button className="btn btn-outline-secondary" type="button" onClick={() => console.log(this.convertState())}>Check state</butto*/}
								<button disabled type="button" className="btn btn-upload" style={{display: 'inline', marginLeft: '1%'}}
									data-toggle="tooltip" data-placement="top" title="Click to upload file"
									data-toggle="modal" data-target="#upload-file-guide" >Upload</button>
							</div>
							
							<input type="text" className="form-control"
								placeholder={this.state.brief}
								value={this.state.brief}
								onChange={this.handleChangeBrief.bind(this)} />
						</div>
					</h1>

					{this.renderRating()}
					<hr className="my-4" />

					{
						buttons
					}

				</div>

			<p className="submitErrorMesssage" style={{color: 'red'}}></p>
		    <button className="btn btn-outline-success" type="button" style={{display: 'inline', marginRight: '1%', width: '15%'}}  
			  			data-toggle="tooltip" data-placement="top" title="Click to update quiz"
			  			onClick = {this.handleSubmit.bind(this)}>Update</button>
			<button className="btn btn-outline-danger" style={{display: 'inline', marginLeft: '1%', width: '15%'}} 
						data-toggle="tooltip" data-placement="top" title="Click to delete quiz"
						type="button" onClick={this.handleDelete.bind(this)}>Delete</button>
			</div>
		);
	}
}

export default EditQuiz;