import React from 'react';
import get_data from './Utils'

////////////////////////////////////
// 			GENERAL INFO		  //
////////////////////////////////////
var Config = require('Config');

class GeneralInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			error: null,
			isLoaded: false,
			fullname: '',
			age: '',
			country: '',
			education: '',
			bio: '',
			id: localStorage.getItem('id'),
		};
	}

	highlight(e) {
	    e.stopPropagation();
		$("#status-overlay").show();
	    $("#highlight-textarea").css('z-index','9999999');
	    $("#highlight-textarea").css('position', 'relative');
	}

	componentDidMount() {

		console.log(this.props.is_editing);
		get_data(`/profile/api/detail/${this.props.username}/`, true)
			.then((res) => res.json())
			.catch(
				(error) => {
					this.setState({
						isLoaded: false,
						error,
						fullname: '',
						age: '',
						country: '',
						education: '',
						bio: ''

					});

				})
			.then(
				(result) => {
					console.log('general-info', result);
					if (result) {
						this.setState({
							isLoaded: true,
							fullname: result['fullname'],
							age: result['age'],
							country: result['country'],
							education: result['education'],
							bio: result['bio']
						});
					} else {
						this.setState({
							isLoaded: true,
							error: null,
							data: {
								fullname: 'n',
								age: 'c',
								country: 'd',
								education: 'e',
								bio: 'f'
							}
						});
					}
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					this.setState({
						isLoaded: true,
						error,
						data: {
							fullname: '',
							age: '',
							country: '',
							education: '',
							bio: ''
						}
					});

				}
			)
	}

	handle_click(e, data) {
		fetch(Config.serverUrl + '/profile/api/update/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + localStorage.getItem('token'),
			},
			body: JSON.stringify(data)
		}).then(res => res.json())
			.then((result) => {
				console.log('update done');
				// for (var i = 0; i < $(".label-info").length; i++) {
				// 	$(".label-info")[i].removeAttribute('hidden');
				// }
				this.props.handle();
				console.log(this.props.is_editing);
			});
	}
	render() {
		if (this.state.isLoaded) {
			return (
				<div className="general-profile">
					<div id="status-overlay" style={{display: "none"}}></div>
					<ul className="list-group" id="highlight-textarea" >

						<li className="list-group-item"  ><strong>Full Name</strong>
							<label className='label-info' hidden={this.props.is_editing}> {this.state.fullname} </label>

							<span className="info">
								<input className="ginput" id='fullname' style={{ border: 'groove' }} ref='fn' hidden={!this.props.is_editing} onClick={this.highlight.bind(this)} onChange={e => this.setState({ fullname: e.target.value })} value={this.state.fullname} />
							</span>
						</li>
						<li className="list-group-item" ><strong>Age</strong>
							<label className='label-info' hidden={this.props.is_editing}> {this.state.age} </label>

							<span className="info">
								<input className="ginput" id='age' ref='age' style={{ border: 'groove' }} hidden={!this.props.is_editing} onClick={this.highlight.bind(this)} onChange={e => this.setState({ age: e.target.value })} value={this.state.age} />

							</span>
						</li>
						<li className="list-group-item" ><strong>Country</strong>
							<label className='label-info' hidden={this.props.is_editing}> {this.state.country} </label>

							<span className="info">
								<input className="ginput" id='country' list="countries" ref='ct' style={{ border: 'groove' }} hidden={!this.props.is_editing} onClick={this.highlight.bind(this)} onFocus={e => e.target.value = ''} onChange={e => this.setState({ country: e.target.value })} value={this.state.country} />
								<datalist id="countries">
									<option value="Vietnam" />
									<option value="England" />
									<option value="America" />
									<option value="Japan" />
								</datalist>

							</span>
						</li>
						<li className="list-group-item" ><strong>Education</strong>
							<label className='label-info' hidden={this.props.is_editing}> {this.state.education} </label>

							<span className="info">
								<input className="ginput" id='education' ref='edu' style={{ border: 'groove' }} hidden={!this.props.is_editing} onClick={this.highlight.bind(this)} onChange={e => this.setState({ education: e.target.value })} value={this.state.education} />

							</span>
						</li>
						<li className="list-group-item" ><strong>Bio</strong>
							<label className='label-info' hidden={this.props.is_editing}> {this.state.bio} </label>

							<span className="info">
								<input className="ginput" id='bio' ref='bio' style={{ border: 'groove' }} hidden={!this.props.is_editing} onClick={this.highlight.bind(this)} onChange={e => this.setState({ bio: e.target.value })} value={this.state.bio} />

							</span>
						</li>

						<li className="list-group-item"> 
							<a style={{color: "#A15959", fontWeight: 'bold', cursor: 'pointer'}}
								hidden={!this.props.is_editing} 
								onClick={e => this.handle_click(e, this.state)}>Save</a> 
					
							
						</li>
					</ul>
					
				</div>
			);
		}
		else {
			return '';
		}

	}

}

export default GeneralInfo;