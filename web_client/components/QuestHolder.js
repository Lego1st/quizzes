import React from "react";
import ReactMdeDemo from "./ReactMdeDemo";
import EquationEditor from "./EquationEditor";
import MarkdownRender from "./MarkdownRender";
import QuestDetail from  "./QuestDetail";
import { CODE_CATEGORY } from "./Constants";
import { QUESTION_TYPE, UPLOAD_FILE_API } from "./Constants";
import { QUIZ_STATUS } from "./Constants";

// var MarkdownRender = require("./QuestDetail").MarkdownRender;
class QuestHolder extends React.Component {
	constructor(props) {
		super(props);
		var intial_state = props.intial_state;
		var numOptions = props.numOptions;
		var addable = 1;

		if (props.intial_state.type  ==  2) {
			// intial_state['options'] = intial_state['answer']
			numOptions = 1;
			addable = 0;
		}

		this.state = {
			question: intial_state,
			numOptions: numOptions,
			initNumOptions: numOptions,
			addable: addable,
			preview: false
		}
		
		console.log("Adding new question " + props.index + ":", this.state.question);
	}

	componentDidMount() {
		$(".md-editor-tabs").children().remove();
	}

	handleDelete() {
		this.props.handleDeleteQuestion(this.props.order);
	}

	handleChangeContent(_content) {
		var new_question = this.state.question;
		new_question['content'] = _content;
		this.setState({ question: new_question })
		console.log("Changing content of question " + this.state.question.index + " to " + _content)
	}

	validateOptions() {
		var options = this.state.question.options;
		if (options.length == 0 && this.state.question.type != 2) {
			return false;
		}

		for(let i = 0; i < options.length-1; i++){
			if (!options[i]) {
				return false;
			}

			for(let j = i + 1; j < options.length; j++){
				if (options[i] == options[j]) {
					return false;
				}
			}
		}
		return true;
	}

	validateMatchings() {
		var matchings = this.state.question.matchings;
		if (matchings.length == 0) {
			return false;
		}

		for(let i = 0; i < matchings.length-1; i++){
			if (!matchings[i]) {
				return false;
			}

			for(let j = i + 1; j < matchings.length; j++){
				if (matchings[i] == matchings[j]) {
					return false;
				}
			}
		}	
		return true;
	}

	validateAnswer() {
		var answer = this.state.question.answer;
		if (answer.length == 0 && this.state.question.type != 3) {
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

	displayError(_text) {
		$(".errorMessage-" + this.props.index).text(_text);
	}

	handleSave() {
		if (!this.validateOptions()) {
			if (this.state.question.options.length != 0 && this.state.question.type != 2) {
				this.displayError("Please check your options, of which you might missed or duplicated some.");
			}
			else {
				this.displayError("Please specify the options!");	
			}
			$(".optCrl").find(".form-control")[0].focus();
			return;
		}

		if (this.state.question.type == 3 && !this.validateMatchings()) {
			this.displayError("Please check your matchings, of which you might missed or duplicated some.");			
			$(".optCrl").find(".form-control")[0].focus();
			return;
		}

		if (!this.validateContent()) {
			this.displayError("Please give some content to help user understand your quiz.");
			$(".md-editor-textarea").focus();
			return;
		}

		if (!this.validateAnswer()) {
			this.displayError("Please specify the answer.");
			$(".optCrl").find('form').find("input")[0].focus();
			return;
		}

		this.props.savingQuestion(this.state.question, this.props.order);
		this.displayError("");
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
		if (!this.state.addable || this.state.numOptions == 2) {
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


	convertQuestion() {
		var question =  Object.assign({}, this.state.question);

		if (question['type'] == 3) {
			question['answer'] = question['options'];
		}
		if (question['type'] < 2) {
			question['answer'] = question['answer'].map((item) => question['options'][item]);
		}
		question['type'] = QUESTION_TYPE[question['type']];
				
		return question;
	}

	renderQuestionList(questions) {
        return questions.map(question => {
            return <QuestDetail key={question.index} quest_detail={question} viewOnly={true} approvalOnly={true}
                                doQuiz={{}} callbackQuiz={() => {}}/>
        });
    }

	render() {
		const types = ['Single-choice', 'Multiple-choice', 'Filling', 'Matching'];
		const inputs = [];
		const inputs_match = [];

		for (var i = 0; i < this.state.numOptions; i++) {
			if (this.state.question.type != 2) {
				inputs.push(<input ref = {'input' + (i + 1).toString()} 
									key = {'input' + (i + 1).toString()} 
									type = "text" 
									className = "form-control" 
									placeholder =  {this.state.question.options[i] ? this.state.question.options[i] : "Option " + (i+1).toString()}
									value =  {this.state.question.options[i] ? this.state.question.options[i] : ''}
									style = {{display: 'inline', float: 'left', width: '30%', marginLeft: '5%', marginRight: '5%', marginBottom: '1%'}}
									onChange = {this.handleChangeOption.bind(this, i)}/> )
			}
			else {
				inputs.push(<input ref = {'input' + (i + 1).toString()} 
									key = {'input' + (i + 1).toString()} 
									type = "text" 
									className = "form-control" 
									placeholder =  {this.state.question.answer[i] ? this.state.question.answer[i] : "Answer"}
									value =  {this.state.question.answer[i] ? this.state.question.answer[i] : ''}
									style = {{display: 'inline', float: 'left', width: '30%', marginLeft: '5%', marginRight: '5%', marginBottom: '1%'}}
									onChange = {this.handleChangeOption.bind(this, i)}/> )
			}

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
										value = {this.state.question.options[i] ? this.state.question.options[i] : ''}
										placeholder = {this.state.question.answer[i] ? this.state.question.answer[i] : "Match " + (i+1).toString()}
										style = {{display: 'inline', float: 'left', width: '30%', marginLeft: '5%', marginRight: '5%', marginBottom: '1%'}}
										onChange = {this.handleChangeOption.bind(this, i)}/>)
			}
		}

		return (
			<div className = {'whatever-' + this.props.index} style = {{ display: 'inline', textAlign: 'center' }}>
				
				<button type = "button" className = "btn btn-default questholder" style = {{ width: "40%", marginLeft: '5%', marginRight: '5%', marginBottom: '2%' }}
					// onClick = {this.loadCodeCog.bind(this)}
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
								{/*<i className = "fas fa-arrows-alt-v" data-toggle = "tooltip" 
									data-placement = "top" title = "Click to toggle live review"
									style = {{fontSize: '15px', margin: '1%', cursor: 'pointer'}} 
									onClick = {this.togglePreview.bind(this)}> Toggle preview</i>*/}
								<nav  style={{marginLeft: '1%'}}>
								  <div className="nav nav-tabs" id="nav-tab" role="tablist">
								    <a className="nav-item nav-link active" id="nav-editor-tab" data-toggle="tab" href={"#nav-editor-"  + this.props.index}role="tab" aria-controls="nav-editor" aria-selected="true">Editor</a>
								    <a className="nav-item nav-link" id="nav-preview-tab" data-toggle="tab" href={"#nav-preview-" + this.props.index} role="tab" aria-controls="nav-preview" aria-selected="false">Preview</a>
								  </div>
								</nav>

								<button type = "button" className = "close" data-dismiss = "modal" aria-label = "Close">
									<span aria-hidden = "true">&times;</span>
								</button>
							</div>
							
							<div className = "modal-body container" style = {{ display: 'inline', textAlign: 'center' }}>
								<div className="tab-content" id="nav-tabContent">
								  <div className="tab-pane fade show active" id={"nav-editor-" + this.props.index} role="tabpanel" aria-labelledby="nav-editor-tab">
								  		<ReactMdeDemo handleOnChange = {this.handleChangeContent.bind(this)} 
													index = {this.state.question.index}
													initialContent = {this.state.question.content} />

										<hr />	
										
										{/*<button className = "btn btn-default copy-btn" data-toggle = "tooltip" 
												data-placement = "top" title = "Click to copy" onClick = {this.insertEquation.bind(this)}
												style = {{marginBottom:'1%'}}>
								          Copy to clipboard
								        </button>*/}
										{/*<EquationEditor index = {this.props.index} />*/}
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
									  <div className="tab-pane fade" id={"nav-preview-" + this.props.index} role="tabpanel" aria-labelledby="nav-preview-tab">

											{/*<div style = {{height: "90%", overflow: "auto", maxHeight: "400px", width: "100%", padding: "30px 10px", border: "1px solid rgb(221, 221, 221)"}}>
												<MarkdownRender source = {this.state.question.content}/>
											</div>*/}											
											{this.renderQuestionList([this.convertQuestion(this.state.question)])}
									  </div>

								  </div>

								  
								</div>
																
															
							<div className = "modal-footer">
								<p className = {"errorMessage-" + this.props.index} style = {{color: 'red'}}></p>
								<button type = "button" className = "btn btn-secondary closeModal" data-dismiss = "modal">Close</button>
								<button type = "button" className = "btn btn-secondary" onClick = {this.handleSave.bind(this)}>Save</button>
								{/*<button type = "button" className = "btn btn-secondary" onClick = {() => console.log(this.state.question)}>Check</button>*/}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default QuestHolder;