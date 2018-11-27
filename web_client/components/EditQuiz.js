import React from "react";
import ReactMdeDemo from "./ReactMdeDemo";
import {CODE_CATEGORY} from "./Constants";
import {CATEGORY_CODE} from "./Constants";
import {QUESTION_TYPE} from "./Constants";
import {TYPE_QUESTION} from "./Constants";
import {QUIZ_STATUS} from "./Constants";
import get_data from './Utils'

var Config = require('Config');

class QuestHolder extends React.Component {
	constructor(props) {
		super(props);
		const intial_state = props.intial_state;
		this.state = {
			index: intial_state.index,
			content: intial_state.content,
			type: intial_state.type,
			matchings: intial_state.matchings ? intial_state.matchings : [],
			options: intial_state.options,
			answer: intial_state.answer
		};

		console.log("Loaded state of question " + props.index + ":", this.state);
	}

	handleDelete() {
		this.props.handleDeleteQuestion(this.props.index);
	}

	handleChangeContent(_content) {
		this.setState({content: _content})
		console.log("Changing content of question " + this.state.index + " to " + _content)
	}

	handleSave() {
		this.props.savingQuestion(this.state, this.state.index)
	}

	handleChangeOption(index, event) {
		if (this.state.type != 2) {
			const new_options =  this.state.options;
			new_options[index] = event.target.value;
			this.setState({options: new_options})			
			console.log('Change option to ', this.state.options);
		}

		else {
			const new_answer =  this.state.answer;
			new_answer[index] = event.target.value;
			this.setState({answer: new_answer})			
			console.log('Change answer to ', this.state.answer);	
		}

	}

	handleChangeMatching(index, event) {
		const new_matchings =  this.state.matchings;
		new_matchings[index] = event.target.value;
		this.setState({matchings: new_matchings})

		console.log('Change matchings to ', this.state.matchings);
	}

	handleChangeType(_type, event) {
		this.setState({type: _type, options: [], matchings: [], answer: []});
		this.refs.input1.value = "";
		this.refs.input2.value = "";
		this.refs.input3.value = "";
		this.refs.input4.value = "";

		if (_type == 3) {
			if (this.refs.input5) {
				this.refs.input5.value = "";
				this.refs.input6.value = "";
				this.refs.input7.value = "";
				this.refs.input8.value = "";
				
			}
		}

		console.log("Change type of question " + this.state.index + " to " + _type); 
	}

	handleChangeAnswer(index, event) {
		if (this.state.type == 0) {
			this.setState({answer: [index]});
		}
		else if (this.state.type == 1) {
			var new_answer = this.state.answer;
			if (!new_answer.includes(index)) {
				new_answer.push(index);
			}
			else {
				new_answer = new_answer.slice(0, index).concat(new_answer.slice(index + 1));
			}
			this.setState({answer: new_answer});
		}

		console.log("Change answer of question " + this.state.index + " to ", this.state.answer);
	}

	render() {
		const types = ['Single-choice', 'Multiple-choice', 'Filling', 'Matching'];
		const inputs = [];
		const inputs_match = [];

		for (var i = 0; i < 4; i++) {
			inputs.push(<input ref = {'input' + i + 1} key = {'input' + i + 1} type="text" className="form-control" placeholder= {this.state.options[i]}
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeOption.bind(this, i)}/> )
			if (this.state.type == 0){ 
				if (this.state.answer.includes(i)) {
		  			inputs.push(<input key = {i} style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
		  				 onChange = {this.handleChangeAnswer.bind(this, i)} type="radio" name="optradio" checked/>)	
				}
				else {
					inputs.push(<input key = {i} style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
		  				 onChange = {this.handleChangeAnswer.bind(this, i)} type="radio" name="optradio"/>)		
				}
			}
			else if (this.state.type == 1){
				if (this.state.answer.includes(i)) {
					inputs.push(<input key = {i} style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
  					 onChange = {this.handleChangeAnswer.bind(this, i)} type="checkbox" checked/>)
				}
  				else {
  					inputs.push(<input key = {i} style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
  					 onChange = {this.handleChangeAnswer.bind(this, i)} type="checkbox"/>)
  				}

			}

		}

		if (this.state.type == 3) {
			for (var i = 0; i < 4; i++) {
				inputs_match.push(<input ref = {'input' + i + 1} key = {'input' + i + 1} type="text" className="form-control" placeholder={this.state.matchings[i]}
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeMatching.bind(this, i)}/>)

			  	inputs_match.push(<input ref = {'input' + i + 2} key = {'input' + i + 2} type="text" className="form-control" placeholder={this.state.answer[i]}
					style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
			  		onChange = {this.handleChangeOption.bind(this, i)}/>)
			}
		}

		return (
			<div className = {'whatever-' + this.props.index} style = {{display: 'inline', textAlign: 'center'}}>
				<button type="button" className="btn btn-default" style = {{width: "40%", marginLeft: '5%', marginRight: '5%', marginBottom: '2%'}} 
						data-toggle="modal" data-target={"#question-" + this.props.index} >{this.props.brief}</button>
				<button type="button" onClick = {this.handleDelete.bind(this)} className="btn" style = {{backgroundColor: 'white', width: "5%", marginLeft: '-5%', marginRight: '0%', marginBottom: '2%'}}><i className="far fa-trash-alt"></i></button>
				<div className="modal fade bd-example-modal-lg" id = {"question-" + this.props.index} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
				  <div className="modal-dialog modal-lg">
				    <div className="modal-content">
				      <div className="modal-header">

				        <div className="input-group-prepend">
						    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{types[this.state.type]}</button>
						    <div className="dropdown-menu">
						      <a className="dropdown-item" onClick = {this.handleChangeType.bind(this, 0)} href="#">Single-choice</a>
						      <a className="dropdown-item" onClick = {this.handleChangeType.bind(this, 1)} href="#">Multiple-choice</a>
						      <a className="dropdown-item" onClick = {this.handleChangeType.bind(this, 2)} href="#">Filling</a>
						      <div role="separator" className="dropdown-divider"></div>
						      <a className="dropdown-item" onClick = {this.handleChangeType.bind(this, 3)} href="#">Matching</a>
						    </div>
					  	</div>

				        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
				          <span aria-hidden="true">&times;</span>
				        </button>
				      </div>
				      <div className="modal-body" style = {{display: 'inline', textAlign: 'center'}}>
				        <ReactMdeDemo handleOnChange = {this.handleChangeContent.bind(this)} index = {this.state.index} initialContent = {this.state.content}/>
				
				        <hr/>
								{this.state.type < 3 ? (
						        	<form className = 'options&answer'>
							        	{
							        		inputs
							        	}
							  					 
							  		</form>
						      	) : (
							      	<div className = 'options&answer'>
						        		{
						        			inputs_match
						        		}
								    </div>
							    )}
							

				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
				        <button type="button" className="btn btn-secondary" onClick={this.handleSave.bind(this)} data-dismiss="modal">Saving</button>
				      </div>
				    </div>
				  </div>
				</div>
			</div>
		);		
	}
}

function Adder(props) {
	return (
		<div className = {'whatever-' + props.index} style = {{display: 'inline', textAlign: 'center'}}>
			<button type="button" className="btn btn-default" style = {{border: 'dashed', backgroundColor: 'white', width : "40%", marginLeft: '5%', marginRight: '5%', marginBottom: '2%'}} 
					data-toggle="modal" data-target={"#adder-" + props.index}  onClick = {props.handleAddQuestion.bind(this, props.index)}>Adding question {props.index}</button>
		</div>
	);
}

class EditQuiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: null,
			title: "This is a title, click to edit.",
			brief: 'This is a brief',
			category : "Category",
			shuffle: false,
			rating : 1.0,
			questions: [],
			deletions: []
		};
		this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
		this.handleAddQuestion = this.handleAddQuestion.bind(this);
		this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
	}

	componentDidMount() {
		console.log(this.props.match.params.quizid);
		get_data("/api/full_quiz/" + this.props.match.params.quizid + "/", false).then((res) => res.json())
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

	handleDeleteQuestion(index) {
		const new_deletions = this.state.deletions;
		new_deletions.push(index);
		this.setState({deletions: new_deletions});
		console.log(this.state.deletions);
	}

	convertState() {
		const converted_state = Object.assign({}, this.state);
		const converted_questions = [];
		console.log("Delete: ", converted_state.deletions);
		for (var i = 0; i < converted_state.questions.length; i++) {
			const question = Object.assign({}, converted_state.questions[i]);
			if (converted_state.deletions.includes(question['index'])) {
				continue;
			}
						
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
		delete converted_state['deletions'];
		delete converted_state['rating'];

		return converted_state;
	}

	handleSubmit(e) {
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
				window.location.reload();				
				console.log(result);
			}
			else {
				alert('Oops! Something went wrong :( Please re-check your form!')
			}
		});
	}

	render() {
		const buttons = [];
		for (var i = 0; i < this.state.questions.length; i++) {
			if (! this.state.deletions.includes(i)) {
				buttons.push( <QuestHolder index = {this.state.questions[i].index} key = {i}
										intial_state = {this.state.questions[i]}
										savingQuestion = {this.handleChangeQuestion}
										handleDeleteQuestion = {this.handleDeleteQuestion}
										brief = {this.state.questions[i].content.substring(0, 20) + '...'}/>)
			}
		}

		buttons.push(<Adder index = {this.state.questions.length} key = {this.state.questions.length}
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
				<div className="jumbotron" style = {{backgroundColor: 'white'}}>
				  <h1 className="display-4">
					    <div className="input-group mb-3">
						  <div className="input-group-prepend">
						    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{CATEGORY_CODE[this.state.category]}</button>
						    <div className="dropdown-menu">
						      {
						      	cate_dropdown
						      }
						      <div role="separator" className="dropdown-divider"></div>
						      <a className="dropdown-item" onClick = {this.handleChangeCategory.bind(this)} href="#">Other</a>
						    </div>
						  </div>
						  <input type="text" className="form-control" 
					  		placeholder={this.state.title}
					  		onChange = {this.handleChangeTitle.bind(this)}/>
						  <div className="input-group-append ">
						  <button className="btn btn-outline-secondary" type="button" onClick={() => console.log(this.convertState())}>Check state</button>
						  </div> 
						</div>
				  </h1>



				  <hr className="my-4"/>
				  	{
				  		buttons
				  	}

				</div>
			  <button className="btn btn-outline-primary" type="button" onClick = {this.handleSubmit.bind(this)}>Update</button>
			</div>
		);
	}
}

export default EditQuiz;