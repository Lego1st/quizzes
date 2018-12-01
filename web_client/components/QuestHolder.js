import React from "react";
import ReactMdeDemo from "./ReactMdeDemo";

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
		this.props.savingQuestion(this.state, this.props.order)
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
								placeholder= {this.state.options[i] ? this.state.options[i] : "Option " + (i+1).toString() }
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
				inputs_match.push(<input ref = {'input' + (i*2).toString()} 
										key = {'input' + (i*2).toString()} 
										type="text" 
										className="form-control" 
										placeholder={this.state.matchings[i]}
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
										onChange = {this.handleChangeMatching.bind(this, i)}/>)

				inputs_match.push(<input ref = {'input' + (i*2 + 1).toString()} 
								  		key = {'input' + (i*2 + 1).toString()}  
										type="text" 
										className="form-control" 
										placeholder={this.state.answer[i]}
										style = {{display: 'inline', width: '30%', marginLeft: '5%', marginRight: '5%'}}
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
								<div className="options&answer">
									<div className="optCrl" style={{width: '3%', fontSize: '20px', float: 'left'}}>
										<i className="fas fa-lg fa-caret-up"></i>
										4
										<i className="fas fa-lg fa-caret-down"></i>
									</div>

									<div>
										{this.state.type < 3 ? (
											<form>
												{
													inputs
												}

											</form>
										) : (
												<div>
													{
														inputs_match
													}
												</div>
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