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

		get_data("/profile/api/get/?profileid=" + localStorage.getItem('id'), true)
			.then(res => res.json())
			.then(
				(result) => {
					console.log('general-info', result);
					this.setState({
						isLoaded: true,
						data: result
					});
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
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

				}
			)
	}

	render() {
		if (this.state.isLoaded) {
			return (
				<div>
				<ul className="list-group">

					<li className="list-group-item"><strong>First Name</strong>
						<button className="edit-btn"><i className="fas fa-edit"></i></button><span className="info"><input id='first-name' disabled>{this.state.data['first_name']}</input></span></li>
					<li className="list-group-item"><strong>Last Name</strong>
						<button className="edit-btn"><i className="fas fa-edit"></i></button><span className="info"><input id='last_name' disabled>{this.state.data['last_name']}</input></span></li>
					<li className="list-group-item"><strong>Age</strong>
						<button className="edit-btn"><i className="fas fa-edit"></i></button><span className="info"><input id='age' disabled>{this.state.data['age']}</input></span></li>
					<li className="list-group-item"><strong>Country</strong>
						<button className="edit-btn"><i className="fas fa-edit"></i></button><span className="info"><input id='country' disabled>{this.state.data['country']}</input></span></li>
					<li className="list-group-item"><strong>Education</strong>
						<button className="edit-btn"><i className="fas fa-edit"></i></button><span className="info"><input id='education' disabled>{this.state.data['education']}</input></span></li>
					<li className="list-group-item"><strong>Bio</strong>
						<button className="edit-btn"><i className="fas fa-edit"></i></button><span className="info"><input id='bio' disabled>{this.state.data['bio']}</input></span></li>
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