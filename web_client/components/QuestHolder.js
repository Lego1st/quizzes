import React from "react";
import ReactMdeDemo from "./ReactMdeDemo";
import EquationEditor from "./EquationEditor";
import MarkdownRender from "./MarkdownRender";
// var MarkdownRender = require("./QuestDetail").MarkdownRender;
class QuestHolder extends React.Component {
	constructor(props) {
		super(props);
		var intial_state = props.intial_state;
		var numOptions = props.numOptions;
		var addable = 1;

		if (props.intial_state.type  ==  2) {
			intial_state['options'] = intial_state['answer']
			numOptions = 1;
			addable = 0;
		}

		this.state = {
			question: intial_state,
			numOptions: numOptions,
			initNumOptions: numOptions,
			addable: addable,
			preview: true
		}
		
		console.log("Adding new question " + props.index + ":", this.state.question);
	}

	componentDidMount() {
		$(".md-editor-tabs").children().remove();
	}

	handleDelete() {
		this.props.handleDeleteQuestion(this.props.index);
	}

	handleChangeContent(_content) {
		var new_question = this.state.question;
		new_question['content'] = _content;
		this.setState({ question: new_question })
		console.log("Changing content of question " + this.state.question.index + " to " + _content)
	}

	validateOptions() {
		var options = this.state.question.options;
		if (options.length == 0) {
			return false;
		}

		for(let i = 0; i < options.length-1; i++){
			for(let j = i + 1; j < options.length; j++){
				if (!options[i]) {
					return false;
				}
				else if (options[i] == options[j]) {
					return false;
				}
			}
		}
		return true;
	}

	validateAnswer() {
		var answer = this.state.question.answer;
		if (answer.length == 0) {
			return false;
		}
		return true;
	}

	validateContent() {
		
		if (this.state.question.content.replace(/ /g,'') == '') {
			return false;
		}
		return true;
	}

	handleSave() {
		if (!this.validateOptions()) {
			if (this.state.question.options.length != 0) {
				$(".errorMessage").text("Please check your options, of which you might missed or duplicated some.");
			}
			else {
				$(".errorMessage").text("Please specify the options!");	
			}
			$(".optCrl").find(".form-control")[0].focus();
			return;
		}

		if (!this.validateContent()) {
			$(".errorMessage").text("Please give some content to help user understand your quiz.");
			$(".md-editor-textarea").focus();
			return;
		}

		if (!this.validateAnswer()) {
			$(".errorMessage").text("Please specify the answer.");
			$(".optCrl").find('form').find("input")[0].focus();
			return;
		}

		this.props.savingQuestion(this.state.question, this.props.order);
		$(".errorMessage").text("");
		$(".closeModal").click();
	}

	handleChangeOption(index, event) {
		if (this.state.question.type !=  2) {
			const new_options = this.state.question.options;
			new_options[index] = event.target.value;
			var new_question = this.state.question;
			new_question['options'] = new_options;
			this.setState({ question: new_question })
			console.log('Change option to ', this.state.question.options);
		}

		else {
			const new_answer = this.state.question.answer;
			new_answer[index] = event.target.value;
			var new_question = this.state.question;
			new_question['answer'] = new_answer;
			this.setState({ question: new_question })
			console.log('Change answer to ', this.state.question.answer);
		}

	}

	handleChangeMatching(index, event) {
		const new_matchings = this.state.question.matchings;
		new_matchings[index] = event.target.value;
		var new_question = this.state.question;
		new_question['matchings'] = new_matchings;
		this.setState({ question: new_question })

		console.log('Change matchings to ', this.state.question.matchings);
	}

	handleChangeType(_type, event) {
		const new_question = { index: this.state.question.index, type: _type, content: this.state.question.content, options: [], matchings: [], answer: [] };
		
		if (_type !=  2) {
			this.setState({ question: new_question, numOptions: this.state.initNumOptions, addable: 1 })			
		}
		else {
			this.setState({ question: new_question, numOptions: 1, addable: 0})
		}

		for (var i = 0; i < this.state.numOptions; i++) {
			this.refs['input' + (i + 1).toString()] = "";
		}
		
		if (_type  ==  3) {
			for (var i = this.state.numOptions; i < this.state.numOptions * 2; i++) {
				this.refs['input' + (i + 1).toString()] = "";
			}
		}

		console.log("Change type of question " + this.state.question.index + " to " + _type);
	}

	handleChangeAnswer(index, event) {
		if (this.state.question.type  ==  0) {
			var new_question = this.state.question;
			new_question['answer'] = [index];
			this.setState({ question: new_question })
		}
		else if (this.state.question.type  ==  1) {
			var new_answer = this.state.question.answer;
			if (!new_answer.includes(index)) {
				new_answer.push(index);
			}
			else {
				new_answer = new_answer.slice(0, index).concat(new_answer.slice(index + 1));
			}
			var new_question = this.state.question;
			new_question['answer'] = new_answer;
			this.setState({ question: new_question })
		}

		console.log("Change answer of question " + this.state.question.index + " to ", this.state.question.answer);
	}

	increaseOptions() {
		if (!this.state.addable) {
			return;
		}
		this.setState({numOptions: this.state.numOptions + 1});
	}


	decreaseOptions() {
		if (!this.state.addable || this.state.numOptions == 1) {
			return;
		}

		var new_question = this.state.question;
		new_question['options'] = new_question['options'].slice(0, -1);

		const new_num_options = this.state.numOptions - 1;
		
		this.setState({numOptions: new_num_options, question: new_question});		
	}

	insertEquation() {
		var copyText = $("#testbox");
		copyText.val('$' + copyText.val() + '$');
		copyText.select();
		document.execCommand("copy");
		
		
		$(".copy-btn").attr("data-original-title", "Copied to clipboard");
		$(".copy-btn").tooltip("toggle");
		$(".copy-btn").attr("data-original-title", "Click to copy");
	}

	loadCodeCog() {
		EqEditor.embed('editor-' + this.props.index,'');

	    var a = new EqTextArea('equation', 'testbox');
	    EqEditor.add(a,false);
	}

	render() {
		const types = ['Single-choice', 'Multiple-choice', 'Filling', 'Matching'];
		const inputs = [];
		const inputs_match = [];

		for (var i = 0; i < this.state.numOptions; i++) {
			inputs.push(<input ref = {'input' + (i + 1).toString()} 
								key = {'input' + (i + 1).toString()} 
								type = "text" 
								className = "form-control" 
								placeholder =  {this.state.question.options[i] ? this.state.question.options[i] : "Option " + (i+1).toString()}
								value =  {this.state.question.options[i] ? this.state.question.options[i] : ''}
								style = {{display: 'inline', float: 'left', width: '30%', marginLeft: '5%', marginRight: '5%', marginBottom: '1%'}}
								onChange = {this.handleChangeOption.bind(this, i)}/> )

			if (this.state.question.type  ==  0){ 
				if (this.state.question.answer.includes(i)) {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', float: 'left', width: '2%', marginLeft: '-4%', marginRight: '0%', marginTop: '2%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type = "radio"
										name = "optradio" checked/>)	
				}
				else {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', float: 'left', width: '2%', marginLeft: '-4%', marginRight: '0%', marginTop: '2%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type = "radio" 
										name = "optradio"/>)		
				}
			}
			else if (this.state.question.type  ==  1){
				if (this.state.question.answer.includes(i)) {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', float: 'left', width: '2%', marginLeft: '-4%', marginRight: '0%', marginTop: '2%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type = "checkbox" checked/>)
				}
				else {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', float: 'left', width: '2%', marginLeft: '-4%', marginRight: '0%', marginTop: '2%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type = "checkbox" />)
				}
			}
		}

		if (this.state.question.type  ==  3) {
			for (var i = 0; i < this.state.numOptions; i++) {
				inputs_match.push(<input ref = {'input' + (i*2).toString()} 
										key = {'input' + (i*2).toString()} 
										type = "text" 
										className = "form-control" 
										value = {this.state.question.matchings[i] ? this.state.question.matchings[i] : ''}
										placeholder = {this.state.question.matchings[i] ? this.state.question.matchings[i] : "Quest " + (i+1).toString()}
										style = {{display: 'inline', float: 'left', width: '30%', marginLeft: '5%', marginRight: '5%', marginBottom: '1%'}}
										onChange = {this.handleChangeMatching.bind(this, i)}/>)

				inputs_match.push(<input ref = {'input' + (i*2 + 1).toString()} 
								  		key = {'input' + (i*2 + 1).toString()}  
										type = "text" 
										className = "form-control" 
										value = {this.state.question.answer[i] ? this.state.question.answer[i] : ''}
										placeholder = {this.state.question.answer[i] ? this.state.question.answer[i] : "Match " + (i+1).toString()}
										style = {{display: 'inline', float: 'left', width: '30%', marginLeft: '5%', marginRight: '5%', marginBottom: '1%'}}
										onChange = {this.handleChangeOption.bind(this, i)}/>)
			}
		}

		return (
			<div className = {'whatever-' + this.props.index} style = {{ display: 'inline', textAlign: 'center' }}>
				
				<button type = "button" className = "btn btn-default questholder" style = {{ width: "40%", marginLeft: '5%', marginRight: '5%', marginBottom: '2%' }}
					onClick = {this.loadCodeCog.bind(this)}
					data-toggle = "modal" data-target = {"#question-" + this.props.index} >{this.props.brief}</button>
				<button type = "button" onClick = {this.handleDelete.bind(this)} className = "btn" style = {{ backgroundColor: 'white', width: "5%", marginLeft: '-5%', marginRight: '0%', marginBottom: '2%' }}><i className = "far fa-trash-alt"></i></button>
				<div className = "modal fade bd-example-modal-lg" id = {"question-" + this.props.index} tabIndex = "-1" role = "dialog" aria-labelledby = "myLargeModalLabel" aria-hidden = "true">
					<div className = "modal-dialog modal-lg">
						<div className = "modal-content">
							<div className = "modal-header">

								<div className = "input-group-prepend">
									<button className = "btn btn-outline-secondary dropdown-toggle" type = "button" data-toggle = "dropdown" aria-haspopup = "true" aria-expanded = "false">{types[this.state.question.type]}</button>
									<div className = "dropdown-menu">
										<a className = "dropdown-item" onClick = {this.handleChangeType.bind(this, 0)} href = "#">Single-choice</a>
										<a className = "dropdown-item" onClick = {this.handleChangeType.bind(this, 1)} href = "#">Multiple-choice</a>
										<a className = "dropdown-item" onClick = {this.handleChangeType.bind(this, 2)} href = "#">Filling</a>
										<div role = "separator" className = "dropdown-divider"></div>
										<a className = "dropdown-item" onClick = {this.handleChangeType.bind(this, 3)} href = "#">Matching</a>
									</div>
								</div>

								<button type = "button" className = "close" data-dismiss = "modal" aria-label = "Close">
									<span aria-hidden = "true">&times;</span>
								</button>
							</div>
							<div className = "modal-body container" style = {{ display: 'inline', textAlign: 'center' }}>
								<ReactMdeDemo handleOnChange = {this.handleChangeContent.bind(this)} 
											index = {this.state.question.index}
											initialContent = {this.state.question.content} />
								<i className = "fas fa-arrows-alt-v" data-toggle = "tooltip" 
									data-placement = "top" title = "Click to toggle live review"
									style = {{fontSize: '30px', margin: '1%', cursor: 'pointer'}} 
									onClick = {()  => this.setState({preview: !this.state.preview})}></i>
								
								{this.state.preview &&
									<div style = {{height: "90%", overflow: "auto", maxHeight: "400px", width: "100%", padding: "30px 10px", border: "1px solid rgb(221, 221, 221)"}}>
										<MarkdownRender source = {this.state.question.content}/>
									</div>
								}
								
								
								<hr />	
								
									<button className = "btn btn-default copy-btn" data-toggle = "tooltip" 
											data-placement = "top" title = "Click to copy" onClick = {this.insertEquation.bind(this)}
											style = {{marginBottom:'1%'}}>
							          Copy to clipboard
							        </button>
								<EquationEditor index = {this.props.index} />								
								<hr />
								<div className = "options&answer row">
									<div className = "col-sm-1">
									</div>
									<div className = "optCrl col-sm-1" >
										<div style = {{width: '1%', fontSize: '20px', textAlign: 'center'}}>
											<i className = "fas fa-lg fa-caret-up" onClick = {this.increaseOptions.bind(this)}></i>
											{this.state.numOptions}
											<i className = "fas fa-lg fa-caret-down" onClick = {this.decreaseOptions.bind(this)}></i>
										</div>
									</div>

									<div className = "optCrl col-sm-10" style = {{paddingLeft: '0%', paddingRight: '0%'}}>
										{this.state.question.type < 3 ? (
											<form>
												{
													inputs
												}

											</form>
										) : (
												<form>
													{
														inputs_match
													}
												</form>
											)}
									</div>
								</div>


							</div>
							<div className = "modal-footer">
								<p className = "errorMessage" style = {{color: 'red'}}></p>
								<button type = "button" className = "btn btn-secondary closeModal" data-dismiss = "modal">Close</button>
								<button type = "button" className = "btn btn-secondary" onClick = {this.handleSave.bind(this)}>Saving</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default QuestHolder;