import React from "react";
import ReactMdeDemo from "./ReactMdeDemo";

class QuestHolder extends React.Component {
	constructor(props) {
		super(props);
		const intial_state = props.intial_state;
		this.state = {
			question: props.intial_state,
			numOptions: props.numOptions
		}
		
		console.log("Adding new question " + props.index + ":", this.state.question);
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

	handleSave() {
		this.props.savingQuestion(this.state.question, this.props.order)
	}

	handleChangeOption(index, event) {
		if (this.state.question.type != 2) {
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
		this.setState({ question: new_question })

		for (var i = 0; i < this.state.numOptions; i++) {
			this.refs['input' + (i + 1).toString()] = "";
		}
		
		if (_type == 3) {
			for (var i = this.state.numOptions; i < this.state.numOptions * 2; i++) {
				this.refs['input' + (i + 1).toString()] = "";
			}
		}

		console.log("Change type of question " + this.state.question.index + " to " + _type);
	}

	handleChangeAnswer(index, event) {
		if (this.state.question.type == 0) {
			var new_question = this.state.question;
			new_question['answer'] = [index];
			this.setState({ question: new_question })
		}
		else if (this.state.question.type == 1) {
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

	render() {
		const types = ['Single-choice', 'Multiple-choice', 'Filling', 'Matching'];
		const inputs = [];
		const inputs_match = [];

		for (var i = 0; i < this.state.numOptions; i++) {
			inputs.push(<input ref = {'input' + (i + 1).toString()} 
								key = {'input' + (i + 1).toString()} 
								type="text" 
								className="form-control" 
								placeholder= {this.state.question.options[i] ? this.state.question.options[i] : "Option " + (i+1).toString() }
								style = {{display: 'inline', float: 'left', width: '30%', marginLeft: '5%', marginRight: '5%', marginBottom: '1%'}}
								onChange = {this.handleChangeOption.bind(this, i)}/> )

			if (this.state.question.type == 0){ 
				if (this.state.question.answer.includes(i)) {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', float: 'left', width: '2%', marginLeft: '-4%', marginRight: '0%', marginTop: '2%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type="radio"
										name="optradio" checked/>)	
				}
				else {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', float: 'left', width: '2%', marginLeft: '-4%', marginRight: '0%', marginTop: '2%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type="radio" 
										name="optradio"/>)		
				}
			}
			else if (this.state.question.type == 1){
				if (this.state.question.answer.includes(i)) {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', float: 'left', width: '2%', marginLeft: '-4%', marginRight: '0%', marginTop: '2%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type="checkbox" checked/>)
				}
				else {
					inputs.push(<input key = {i} 
										style = {{display: 'inline', float: 'left', width: '2%', marginLeft: '-4%', marginRight: '0%', marginTop: '2%'}} 
										onChange = {this.handleChangeAnswer.bind(this, i)} 
										type="checkbox" />)
				}
			}
		}

		if (this.state.question.type == 3) {
			for (var i = 0; i < this.state.numOptions; i++) {
				inputs_match.push(<input ref = {'input' + (i*2).toString()} 
										key = {'input' + (i*2).toString()} 
										type="text" 
										className="form-control" 
										placeholder={this.state.question.matchings[i] ? this.state.question.matchings[i] : "Quest " + (i+1).toString()}
										style = {{display: 'inline', float: 'left', width: '30%', marginLeft: '5%', marginRight: '5%', marginBottom: '1%'}}
										onChange = {this.handleChangeMatching.bind(this, i)}/>)

				inputs_match.push(<input ref = {'input' + (i*2 + 1).toString()} 
								  		key = {'input' + (i*2 + 1).toString()}  
										type="text" 
										className="form-control" 
										placeholder={this.state.question.answer[i] ? this.state.question.answer[i] : "Match " + (i+1).toString()}
										style = {{display: 'inline', float: 'left', width: '30%', marginLeft: '5%', marginRight: '5%', marginBottom: '1%'}}
										onChange = {this.handleChangeOption.bind(this, i)}/>)
			}
		}

		return (
			<div className={'whatever-' + this.props.index} style={{ display: 'inline', textAlign: 'center' }}>
				<button type="button" className="btn btn-default questholder" style={{ width: "40%", marginLeft: '5%', marginRight: '5%', marginBottom: '2%' }}
					data-toggle="modal" data-target={"#question-" + this.props.index} >{this.props.brief}</button>
				<button type="button" onClick={this.handleDelete.bind(this)} className="btn" style={{ backgroundColor: 'white', width: "5%", marginLeft: '-5%', marginRight: '0%', marginBottom: '2%' }}><i className="far fa-trash-alt"></i></button>
				<div className="modal fade bd-example-modal-lg" id={"question-" + this.props.index} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">

								<div className="input-group-prepend">
									<button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{types[this.state.question.type]}</button>
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
							<div className="modal-body container" style={{ display: 'inline', textAlign: 'center' }}>
								<ReactMdeDemo handleOnChange={this.handleChangeContent.bind(this)} 
											index={this.state.question.index}
											initialContent = {this.state.question.content} />

								<hr />
								<div className="options&answer row">
									<div className="optCrl col-sm-2" >
										<div style={{width: '1%', fontSize: '20px', textAlign: 'center'}}>
											<i className="fas fa-lg fa-caret-up" onClick={() => this.setState({numOptions: this.state.numOptions + 1})}></i>
											{this.state.numOptions}
											<i className="fas fa-lg fa-caret-down" onClick={() => this.setState({numOptions: this.state.numOptions - 1})}></i>
										</div>
									</div>

									<div className="optCrl col-sm-10" style={{paddingLeft: '0%', paddingRight: '0%'}}>
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

export default QuestHolder;