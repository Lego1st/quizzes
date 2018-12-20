import React from "react";
import ReactMdeDemo from "./ReactMdeDemo";
import { CODE_CATEGORY } from "./Constants";
import { QUESTION_TYPE, UPLOAD_FILE_API } from "./Constants";
import { QUIZ_STATUS } from "./Constants";
import QuestHolder from "./QuestHolder";
import Adder from "./QuestAdder";

var Config = require('Config');

class AddQuiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			brief: "",
			shuffle: false,
			category: "",
			rating: 1,
			questions: [],
		};
		this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
		this.handleAddQuestion = this.handleAddQuestion.bind(this);
		this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
	}

	handleChangeTitle(event) {
		this.setState({ title: event.target.value })
	}

	handleChangeBrief(event) {
		this.setState({ brief: event.target.value })	
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

		this.setState({ questions: new_questions });
		console.log("state questions:", this.state.questions);
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
		converted_state['category'] = CODE_CATEGORY[converted_state['category']];

		const converted_questions = [];
		for (var i = 0; i < converted_state.questions.length; i++) {
			const question = Object.assign({}, converted_state.questions[i]);
			
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
					$(".addquiz").children().remove();
					$(".addquiz").append("<h3 class='toTitle'>Your quiz was submitted successfully. </h3> <h3 class='toTitle'> Please wait until approval or reload if you want to add a new one!</h3>")
					
				}
				else {
					$(".submitErrorMesssage").text('Oops! Something went wrong :( Please re-check your form!');
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
				let old_questions = this.state.questions;
				console.log(data);

				for (let i = 0; i < Object.values(data.Type).length; i++) {
					let _options = data.Options[i] != '' ? data.Options[i].split("/") : [];
					let _matchings = data.Matchings[i] != '' ? data.Matchings[i].split("/") : [];
					let _answer = data.Answer[i] != '' ? data.Answer[i].split("/") : [];

					if (data.Type[i] < 2) {
						_answer = _answer.map((item) => _options.indexOf(item)); 
					}

					if (data.Type[i] == 3) {
						_options = _answer;
					}
					
					let question = {
						index: i + old_questions.length,
						content: data.Content[i],
						type: data.Type[i],
						matchings: _matchings,
						options: _options,
						answer: _answer
					}
					uploaded_questions.push(question);
				}
				this.setState({questions: old_questions.concat(uploaded_questions)});
				this.refs.guideModel.click();
			})
			.catch(
				(error) => {
					$(".submitErrorMesssage").text("Oops! Something must be wrong with your file");
					this.refs.guideModel.click();
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
			buttons.push(<QuestHolder index={this.state.questions[i].index}
									order={i}
									numOptions={Math.max(4, this.state.questions[i].options.length, this.state.questions[i].answer.length)}
									key={this.state.questions[i].index}
									intial_state={this.state.questions[i]}
									savingQuestion={this.handleChangeQuestion}
									handleDeleteQuestion={this.handleDeleteQuestion}
									brief={this.state.questions[i].content.substring(0, 20) + '...'} />)
			indices.push(this.state.questions[i].index);
		}

		console.log('re-render, indices: ', indices, ' buttons: ', buttons);
		buttons.push(<Adder index={indices.length > 0 ? Math.max.apply(null, indices) + 1 : 0} 
							order={buttons.length} 					
							key={indices.length > 0 ? Math.max.apply(null, indices) + 1 : 0} 
							handleChangeQuestion={this.handleChangeQuestion}
							handleAddQuestion={this.handleAddQuestion}> </Adder>)

		const categories = Object.keys(CODE_CATEGORY);
		console.log(CODE_CATEGORY);
		const cate_dropdown = [];
		for (var i = 0; i < categories.length; i++) {
			cate_dropdown.push(<a key={categories[i]} className="dropdown-item" onClick={this.handleChangeCategory.bind(this)} href="#">{categories[i]}</a>)
		}

		return (
			<div className='container addquiz' style={{ marginTop: '3%', textAlign: 'center' }}>
				<div className="jumbotron" style={{ backgroundColor: '#fbfbfb' }}>
					<h1 className="display-4">
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<button className="btn btn-upload dropdown-toggle categoryDropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.category || "Category"}</button>
								<div className="dropdown-menu">
									{
										cate_dropdown
									}									
								</div>
							</div>
							
							<input type="text" className="form-control titleInput"
								placeholder="This is a title, click to edit."
								onChange={this.handleChangeTitle.bind(this)} />
							
						</div>
					</h1>

					<h1 className="display-4">
						<div className="input-group mb-3">
							<div className="input-group-append ">
								{/*<button className="btn btn-outline-secondary" type="button" onClick={() => console.log(this.convertState())}>Check state</button>*/}
								<button type="button" className="btn btn-upload" style={{display: 'inline', marginLeft: '1%'}}
									data-toggle="tooltip" data-placement="top" title="Click to upload file"
									data-toggle="modal" data-target="#upload-file-guide" >Upload</button>
							</div>
							
							<input type="text" className="form-control briefInput"
								placeholder="This is a brief, click to edit."
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
				<button className="btn btn-outline-success" style={{display: 'inline', width: '15%'}} 
						data-toggle="tooltip" data-placement="top" title="Click to submit quiz"
						type="button" onClick={this.handleSubmit.bind(this)}>Submit</button>

				{/*<button type="button" className="btn btn-outline-info" style={{display: 'inline', marginLeft: '1%'}}
						data-toggle="tooltip" data-placement="top" title="Click to upload file"
						data-toggle="modal" data-target="#upload-file-guide" >Upload</button>*/}

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