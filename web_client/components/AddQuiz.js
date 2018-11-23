import React from "react";
import ReactMdeDemo from "./ReactMdeDemo";

class QuestHolder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: this.props.index,
			content: "",
			type: 0,
			matchings: [],
			options: [],
			answers: []
		};

	}

	handleDelete() {
		this.props.handleDeleteQuestion(this.props.index);
	}

	handleChangeContent(_content) {
		this.setState({content: _content})
		console.log("Changing content of question " + this.state.index + " to " + _content)
	}

	handleSave() {
		this.props.savingQuestion({
			content: this.state.content,
			type: this.state.type,
			matchings: this.state.matchings,
			options: this.state.options,
			answers: this.state.answers
		},
		this.state.index)
	}

	handleChangeOption(index, event) {
		const new_options =  this.state.options;
		new_options[index] = event.target.value;
		this.setState({options: new_options})

		console.log('Change option to ', this.state.options);
	}

	handleChangeMatching(index, event) {
		const new_matchings =  this.state.matchings;
		new_matchings[index] = event.target.value;
		this.setState({matchings: new_matchings})

		console.log('Change matchings to ', this.state.matchings);
	}

	handleChangeType(_type, event) {
		this.setState({type: _type, options: [], matchings: [], answers: []});
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
			this.setState({answers: [index]});
		}
		else if (this.state.type == 1) {
			const new_answers = this.state.answers;
			if (!new_answers.includes(index)) {
				new_answers.push(index);
			}
			else {
				new_answers = new_answers.slice(0, index).concat(new_answers.slice(index + 1));
			}
			this.setState({answers: new_answers});
		}

		console.log("Change answers of question " + this.state.index + " to ", this.state.answers);
	}

	render() {
		const types = ['Single-choice', 'Multiple-choice', 'Filling', 'Matching'];
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
				        <ReactMdeDemo handleOnChange = {this.handleChangeContent.bind(this)} index = {this.state.index}/>
				
				        <hr/>
								{this.state.type < 3 ? (
						        	<form className = 'options&answers'>
							        	<input ref = 'input1' type="text" className="form-control" placeholder="Options 1"
											style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
									  		onChange = {this.handleChangeOption.bind(this, 0)}/> 
									  		{this.state.type == 0 && 
									  			<input style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
									  				 onChange = {this.handleChangeAnswer.bind(this, 0)} type="radio" name="optradio"/>}										  		
								  			{this.state.type == 1 && 
								  				<input style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
								  					 onChange = {this.handleChangeAnswer.bind(this, 0)} type="checkbox" value = ""/>}

									  	<input ref = 'input2' type="text" className="form-control" placeholder="Options 2"
											style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
									  		onChange = {this.handleChangeOption.bind(this, 1)}/>
									  		{this.state.type == 0 && 
									  			<input style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
									  				 onChange = {this.handleChangeAnswer.bind(this, 1)} type="radio" name="optradio"/>}										  		
								  			{this.state.type == 1 && 
								  				<input style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
								  					 onChange = {this.handleChangeAnswer.bind(this, 1)} type="checkbox" value = ""/>}

									  	<input ref = 'input3' type="text" className="form-control" placeholder="Options 3"
											style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
									  		onChange = {this.handleChangeOption.bind(this, 2)}/>
									  		{this.state.type == 0 && 
									  			<input style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
									  				 onChange = {this.handleChangeAnswer.bind(this, 2)} type="radio" name="optradio"/>}										  		
								  			{this.state.type == 1 && 
								  				<input style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
								  					 onChange = {this.handleChangeAnswer.bind(this, 2)} type="checkbox" value = ""/>}

									  	<input ref = 'input4' type="text" className="form-control" placeholder="Options 4"
											style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
									  		onChange = {this.handleChangeOption.bind(this, 3)}/>
									  		{this.state.type == 0 && 
									  			<input style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
									  				 onChange = {this.handleChangeAnswer.bind(this, 3)} type="radio" name="optradio"/>}										  		
								  			{this.state.type == 1 && 
								  				<input style = {{display: 'inline', width: '2%', marginLeft: '-4%', marginRight: '0%'}} 
								  					 onChange = {this.handleChangeAnswer.bind(this, 3)} type="checkbox" value = ""/>}
							  					 
							  		</form>
						      	) : (
							      	<div className = 'options&answers'>
						        	<input ref = 'input1' type="text" className="form-control" placeholder="Quest 1"
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeMatching.bind(this, 0)}/>
								  	<input ref = 'input2' type="text" className="form-control" placeholder="Options 1"
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeOption.bind(this, 0)}/>
								  	<input ref = 'input3' type="text" className="form-control" placeholder="Quest 2"
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeMatching.bind(this, 1)}/>
								  	<input ref = 'input4' type="text" className="form-control" placeholder="Options 2"
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeOption.bind(this, 1)}/>
								  	<input ref = 'input5' type="text" className="form-control" placeholder="Quest 3"
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeMatching.bind(this, 2)}/>
								  	<input ref = 'input6' type="text" className="form-control" placeholder="Options 3"
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeOption.bind(this, 2)}/>
								  	<input ref = 'input7' type="text" className="form-control" placeholder="Quest 4"
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeMatching.bind(this, 3)}/>
								  	<input ref = 'input8' type="text" className="form-control" placeholder="Options 4"
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
								  		onChange = {this.handleChangeOption.bind(this, 3)}/>
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
					data-toggle="modal" data-target={"#adder-" + props.index}  onClick = {props.handleAddQuestion}>Adding question {props.index}</button>
		</div>
	);
}

class AddQuiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "This is a title, click to edit.",
			category : "Category",
			rating : null,
			questions: [],
			deletions: []
		};
		this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
		this.handleAddQuestion = this.handleAddQuestion.bind(this);
		this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
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

	handleAddQuestion() {
		const new_questions = this.state.questions;
		new_questions.push({
			content: 'Edit question ' + new_questions.length,
			type: 0,
			matchings: [],
			options: [],
			answers: []
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

	render() {
		const buttons = [];
		for (var i = 0; i < this.state.questions.length; i++) {
			if (! this.state.deletions.includes(i)) {
				buttons.push( <QuestHolder index = {i} key = {i}
										savingQuestion = {this.handleChangeQuestion}
										handleDeleteQuestion = {this.handleDeleteQuestion}
										brief = {this.state.questions[i].content.substring(0, 20) + '...'}/>)
			}
		}
		buttons.push(<Adder index = {this.state.questions.length} key = {this.state.questions.length}
						handleChangeQuestion = {this.handleChangeQuestion}
						handleAddQuestion = {this.handleAddQuestion}> </Adder>)
		return (
			<div className = 'container' style ={{marginTop: '3%'}}>
				<div className="jumbotron" style = {{backgroundColor: 'white'}}>
				  <h1 className="display-4">
					    <div className="input-group mb-3">
						  <div className="input-group-prepend">
						    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.category}</button>
						    <div className="dropdown-menu">
						      <a className="dropdown-item" onClick = {this.handleChangeCategory.bind(this)} href="#">Math</a>
						      <a className="dropdown-item" onClick = {this.handleChangeCategory.bind(this)} href="#">Logic</a>
						      <a className="dropdown-item" onClick = {this.handleChangeCategory.bind(this)} href="#">Computer Science</a>
						      <div role="separator" className="dropdown-divider"></div>
						      <a className="dropdown-item" onClick = {this.handleChangeCategory.bind(this)} href="#">Other</a>
						    </div>
						  </div>
						  <input type="text" className="form-control" 
					  		placeholder={this.state.title}
					  		onChange = {this.handleChangeTitle.bind(this)}/>
						</div>
				  </h1>



				  <hr className="my-4"/>
				  	{
				  		buttons
				  	}

				</div>
			</div>
		);
	}
}

export default AddQuiz;