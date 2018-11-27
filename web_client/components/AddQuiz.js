import React from "react";
import ReactMdeDemo from "./ReactMdeDemo";
import { CODE_CATEGORY } from "./Constants";
import { QUESTION_TYPE, UPLOAD_FILE_API } from "./Constants";
import { QUIZ_STATUS } from "./Constants";


var Config = require('Config');

class QuestHolder extends React.Component {
	constructor(props) {
		super(props);
		const intial_state = props.intial_state;
		this.state = props.intial_state;

		console.log("Adding new question " + props.index + ":", this.state);
	}

	handleDelete() {
		this.props.handleDeleteQuestion(this.props.index);
	}

	handleChangeContent(_content) {
		this.setState({ content: _content })
		console.log("Changing content of question " + this.state.index + " to " + _content)
	}

	handleSave() {
		this.props.savingQuestion(this.state, this.state.index)
	}

	handleChangeOption(index, event) {
		if (this.state.type != 2) {
			const new_options = this.state.options;
			new_options[index] = event.target.value;
			this.setState({ options: new_options })
			console.log('Change option to ', this.state.options);
		}

		else {
			const new_answer = this.state.answer;
			new_answer[index] = event.target.value;
			this.setState({ answer: new_answer })
			console.log('Change answer to ', this.state.answer);
		}

	}

	handleChangeMatching(index, event) {
		const new_matchings = this.state.matchings;
		new_matchings[index] = event.target.value;
		this.setState({ matchings: new_matchings })

		console.log('Change matchings to ', this.state.matchings);
	}

	handleChangeType(_type, event) {
		this.setState({ type: _type, options: [], matchings: [], answer: [] });
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
			this.setState({ answer: [index] });
		}
		else if (this.state.type == 1) {
			var new_answer = this.state.answer;
			if (!new_answer.includes(index)) {
				new_answer.push(index);
			}
			else {
				new_answer = new_answer.slice(0, index).concat(new_answer.slice(index + 1));
			}
			this.setState({ answer: new_answer });
		}

		console.log("Change answer of question " + this.state.index + " to ", this.state.answer);
	}

	render() {
		const types = ['Single-choice', 'Multiple-choice', 'Filling', 'Matching'];
		const inputs = [];
		const inputs_match = [];

		for (var i = 0; i < 4; i++) {
			inputs.push(<input ref = {'input' + (i + 1).toString()} 
								key = {'input' + (i + 1).toString()} 
								type="text" 
								className="form-control" 
								placeholder= {this.state.options[i] ? this.state.options[i] : "Options" + (i+1).toString() }
								style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								onChange = {this.handleChangeOption.bind(this, i)}/> )

			if (this.state.type == 0){ 
				if (this.state.answer.includes(i)) {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type="radio"
										name="optradio" checked/>)	
				}
				else {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type="radio" 
										name="optradio"/>)		
				}
			}
			else if (this.state.type == 1){
				if (this.state.answer.includes(i)) {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type="checkbox" checked/>)
				}
				else {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type="checkbox" />)
				}
			}
		}

		if (this.state.type == 3) {
			for (var i = 0; i < 4; i++) {
				inputs_match.push(<input ref = {'input' + (i + 1).toString()} 
										key = {'input' + (i + 1).toString()} 
										type="text" 
										className="form-control" 
										placeholder={this.state.matchings[i]}
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
										onChange = {this.handleChangeMatching.bind(this, i)}/>)

				inputs_match.push(<input ref = {'input' + i + 2} 
										key = {'input' + i + 2} 
										type="text" 
										className="form-control" 
										placeholder={this.state.answer[i]}
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
										onChange = {this.handleChangeOption.bind(this, i)}/>)
			}
		}

		return (
			<div className={'whatever-' + this.props.index} style={{ display: 'inline', textAlign: 'center' }}>
				<button type="button" className="btn btn-default" style={{ width: "40%", marginLeft: '5%', marginRight: '5%', marginBottom: '2%' }}
					data-toggle="modal" data-target={"#question-" + this.props.index} >{this.props.brief}</button>
				<button type="button" onClick={this.handleDelete.bind(this)} className="btn" style={{ backgroundColor: 'white', width: "5%", marginLeft: '-5%', marginRight: '0%', marginBottom: '2%' }}><i className="far fa-trash-alt"></i></button>
				<div className="modal fade bd-example-modal-lg" id={"question-" + this.props.index} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">

								<div className="input-group-prepend">
									<button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{types[this.state.type]}</button>
									<div className="dropdown-menu">
										<a className="dropdown-item" onClick={this.handleChangeType.bind(this, 0)} href="#">Single-choice</a>
										<a className="dropdown-item" onClick={this.handleChangeType.bind(this, 1)} href="#">Multiple-choice</a>
										<a className="dropdown-item" onClick={this.handleChangeType.bind(this, 2)} href="#">Filling</a>
										<div role="separator" className="dropdown-divider"></div>
										<a className="dropdown-item" onClick={this.handleChangeType.bind(this, 3)} href="#">Matching</a>
									</div>
								</div>

								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body" style={{ display: 'inline', textAlign: 'center' }}>
								<ReactMdeDemo handleOnChange={this.handleChangeContent.bind(this)} 
											index={this.state.index}
											initialContent = {this.state.content} />

								<hr />
								{this.state.type < 3 ? (
									<form className='options&answer'>
										{
											inputs
										}

									</form>
								) : (
										<div className='options&answer'>
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
		<div className={'whatever-' + props.index} style={{ display: 'inline', textAlign: 'center' }}>
			<button type="button" className="btn btn-default" style={{ border: 'dashed', backgroundColor: 'white', width: "40%", marginLeft: '5%', marginRight: '5%', marginBottom: '2%' }}
				data-toggle="modal" data-target={"#adder-" + props.index} onClick={props.handleAddQuestion.bind(this, props.index)}>Adding question {props.index}</button>
		</div>
	);
}

class AddQuiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "This is a title, click to edit.",
			brief: 'This is a brief',
			shuffle: false,
			category: "Category",
			rating: 1.0,
			questions: [],
			deletions: []
		};
		this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
		this.handleAddQuestion = this.handleAddQuestion.bind(this);
		this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
	}

	handleChangeTitle(event) {
		this.setState({ title: event.target.value })
	}

	handleChangeCategory(event) {
		this.setState({ category: event.currentTarget.textContent })
	}

	handleChangeQuestion(_question, index) {
		// console.log(this)
		const new_questions = this.state.questions;
		new_questions[index] = _question;

		this.setState({ questions: new_questions });
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

		this.setState({ questions: new_questions });
		console.log(this.state.questions);
	}

	handleDeleteQuestion(index) {
		const new_deletions = this.state.deletions;
		new_deletions.push(index);
		this.setState({ deletions: new_deletions });
		console.log(this.state.deletions);
	}

	convertState() {
		const converted_state = Object.assign({}, this.state);
		converted_state['category'] = CODE_CATEGORY[converted_state['category']];

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
		fetch(Config.serverUrl + '/api/create_quiz/', {
			method: 'POST',
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
				}
				else {
					alert('Oops! Something went wrong :( Please re-check your form!')
				}
			})
			.catch(
				(error) => {
					alert('Oops!')
			});
	}

	handleFileUpload(e) {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];
		reader.readAsDataURL(file);

		let formData = new FormData();
		formData.append('quiz_file', file);
		
		console.log("Uploaded file: ", file);
		fetch(Config.serverUrl + UPLOAD_FILE_API, {
			method: 'POST',
			headers: {
				'Authorization': 'Token ' + localStorage.getItem('token'),
				 Accept: 'application/json, text/plain, */*',
			},
			body: formData,
		})
			.then((res) => {
				if (res.ok) {
					return res.json()
				} else {
					console.log(res);
				}
			}).then(result => {
				let data = result['quizz'];
				let uploaded_questions = []
				console.log(data);

				for (let i = 0; i < Object.values(data.Type).length; i++) {
					let _options = data.Options[i] != '' ? data.Options[i].split("/") : [];
					let _matchings = data.Matchings[i] != '' ? data.Matchings[i].split("/") : [];
					let _answer = data.Answer[i] != '' ? data.Answer[i].split("/") : [];

					if (data.Type[i] < 2) {
						_answer = _answer.map((item) => _options.indexOf(item)); // todo: handle cases where options duplicate
					}

					if (data.Type[i] == 3) {
						_options = _answer;
					}
					
					let question = {
						index: i,
						content: data.Content[i],
						type: data.Type[i],
						matchings: _matchings,
						options: _options,
						answer: _answer
					}
					uploaded_questions.push(question);
				}
				this.setState({questions: uploaded_questions});
				this.refs.guideModel.click();
			})

	}

	render() {
		const buttons = [];
		for (var i = 0; i < this.state.questions.length; i++) {
			if (!this.state.deletions.includes(i)) {
				buttons.push(<QuestHolder index={this.state.questions[i].index}
										key={this.state.questions[i].index}
										intial_state={this.state.questions[i]}
										savingQuestion={this.handleChangeQuestion}
										handleDeleteQuestion={this.handleDeleteQuestion}
										brief={this.state.questions[i].content.substring(0, 20) + '...'} />)
			}
		}

		buttons.push(<Adder index={this.state.questions.length} 
			key={this.state.questions.length}
			handleChangeQuestion={this.handleChangeQuestion}
			handleAddQuestion={this.handleAddQuestion}> </Adder>)

		const categories = Object.keys(CODE_CATEGORY);
		console.log(CODE_CATEGORY);
		const cate_dropdown = [];
		for (var i = 0; i < categories.length; i++) {
			cate_dropdown.push(<a key={categories[i]} className="dropdown-item" onClick={this.handleChangeCategory.bind(this)} href="#">{categories[i]}</a>)
		}

		return (
			<div className='container' style={{ marginTop: '3%', textAlign: 'center' }}>
				<div className="jumbotron" style={{ backgroundColor: 'white' }}>

					<h1 className="display-4">
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.category}</button>
								<div className="dropdown-menu">
									{
										cate_dropdown
									}
									<div role="separator" className="dropdown-divider"></div>
									<a className="dropdown-item" onClick={this.handleChangeCategory.bind(this)} href="#">Other</a>
								</div>
							</div>
							
							<input type="text" className="form-control"
								placeholder={this.state.title}
								onChange={this.handleChangeTitle.bind(this)} />
							<div className="input-group-append ">
								<button className="btn btn-outline-secondary" type="button" onClick={() => console.log(this.convertState())}>Check state</button>
								
							</div>
						</div>
					</h1>

					<hr className="my-4" />
					{
						buttons
					}

				</div>
				<button className="btn btn-outline-success" style={{display: 'inline'}} 
						type="button" onClick={this.handleSubmit.bind(this)}>Submit</button>

				<button type="button" className="btn btn-outline-info" style={{display: 'inline'}}
						data-toggle="modal" data-target="#upload-file-guide" >Upload</button>

				<div className="modal fade bd-example-modal-lg" id="upload-file-guide" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h4> Example </h4>

								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body" style={{ display: 'inline', textAlign: 'center' }}>
								
								<table className="table-bordered">
									<thead className="thead-dark">
									  <tr>
										<th>Type</th>
										<th>Content</th>
										<th>Options</th>
										<th>Matchings</th>
										<th>Answer</th>
									  </tr>
									</thead>
									<tbody>
									  <tr className="table-primary">
										<td>0</td>
										<td>Which color makes us feel hungry?</td>
										<td>Red/Yellow/Blue/Green</td>
										<td></td>
										<td>Red</td>
									  </tr>
									  <tr className="table-success">
										<td>1</td>
										<td>Where do you want me to kiss?</td>
										<td>Lips/Cheeks/Both/Anywhere</td>
										<td></td>
										<td>Lips/Cheeks/Both</td>
									  </tr>
									  <tr className="table-danger">
										<td>2</td>
										<td>Best thing in life is ___?</td>
										<td></td>
										<td></td>
										<td>Love</td>
									  </tr>
									  <tr className="table-warning">
										<td>3</td>
										<td>Matching</td>
										<td></td>
										<td>1+1/2+2/4+1/5+5</td>
										<td>2/4/5/10</td>
									  </tr>
									  
									</tbody>
								  </table>
								  <br/>
								  <br/>
								  <h5>Type 0 for Single-choice, 1 for Multiple-choice, 2 for Filling and 3 for Matching</h5>
							</div>
							<div className="modal-footer">
								<input type="file" style = {{width: '40%', float: 'left'}} accept="excel/xlsx" onChange={this.handleFileUpload.bind(this)}/>
								<button type="button" ref="guideModel" className="btn btn-secondary" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddQuiz;