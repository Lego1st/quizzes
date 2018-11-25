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
			data: {},
		};
	}

	componentDidMount() {
		console.log(localStorage.getItem('id'));
		get_data("/profile/api/get/?profileid=" + localStorage.getItem('id'), true)
			.then((res) => res.json())
			.catch(
				(error) => {
					this.setState({
						isLoaded: false,
						error,
						data: {
							first_name: '',
							last_name: '',
							age: '',
							country: '',
							education: '',
							bio: ''
						}
					});

				})
			.then(
				(result) => {
					console.log('general-info', result);
					if (result) {
						this.setState({
							isLoaded: true,
							data: result
						});
					} else {
						this.setState({
							isLoaded: true,
							error: null,
							data: {
								first_name: 'a',
								last_name: 'n',
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
							first_name: '',
							last_name: '',
							age: '',
							country: '',
							education: '',
							bio: ''
						}
					});

				}
			)
	}
	handle_click() {
		fetch(Config.serverUrl + '/profile/api/update/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this.state.data)
		})
	}
	render() {
		if (this.state.isLoaded) {
			return (
				<div>
					<ul className="list-group">

						<li className="list-group-item"><strong>First Name</strong>
							<button className="edit-btn"><i className="fas fa-edit"></i></button>
							<span className="info">
								<input id='first-name' ref='fn' onChange={e => this.setState({...this.state.data,first_name: e.target.value })}>{this.state.data['first_name']}
								</input>
							</span>
						</li>
						<li className="list-group-item"><strong>Last Name</strong>
							<button className="edit-btn"><i className="fas fa-edit"></i>
							</button>
							<span className="info">
								<input id='last_name' ref='ln' onChange={e => this.setState({ ...this.state.data, last_name: e.target.value }) }>{this.state.data['last_name']}
								</input>
							</span>
						</li>
						<li className="list-group-item"><strong>Age</strong>
							<button className="edit-btn"><i className="fas fa-edit"></i>
							</button>
							<span className="info">
								<input id='age' ref='age' onChange={e => this.setState({ ...this.state.data,age: e.target.value }) }>{this.state.data['age']}
								</input>
							</span>
						</li>
						<li className="list-group-item"><strong>Country</strong>
							<button className="edit-btn"><i className="fas fa-edit"></i>
							</button>
							<span className="info">
								<input id='country' ref='ct' onChange={e => this.setState({ ...this.state.data,country: e.target.value }) }>{this.state.data['country']}
								</input>
							</span>
						</li>
						<li className="list-group-item"><strong>Education</strong>
							<button className="edit-btn"><i className="fas fa-edit"></i>
							</button>
							<span className="info">
								<input id='education' ref='edu' onChange={e => this.setState({ ...this.state.data,education: e.target.value }) }>{this.state.data['education']}
								</input>
							</span>
						</li>
						<li className="list-group-item"><strong>Bio</strong>
							<button className="edit-btn"><i className="fas fa-edit"></i>
							</button>
							<span className="info">
								<input id='bio' ref='bio' onChange={e => this.setState({ ...this.state.data,bio: e.target.value }) }>{this.state.data['bio']}
								</input>
							</span></li>
					</ul>
					<button onClick={this.handle_click}>  Change profile</button>
				</div >
			);
		}
		else {
			return '';
		}

	}

}

export default GeneralInfo;