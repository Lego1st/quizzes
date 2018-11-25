import React from 'react';
import get_data from './Utils'

////////////////////////////////////
// 			GENERAL INFO		  //
////////////////////////////////////
var Config = require('Config');

class GeneralInfo extends React.Component {
	constructor(props) {
		super(props);

	}
	state = {
		error: null,
		isLoaded: false,
		fullname: '',
		age: '',
		country: '',
		education: '',
		bio: '',
		id: localStorage.getItem('id'),
	};
	componentDidMount() {
		console.log(localStorage.getItem('id'));
		get_data("/profile/api/get/?profileid=" + localStorage.getItem('id'), true)
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
	handle_click = (e,data) =>{
		fetch(Config.serverUrl + '/profile/api/update/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + localStorage.getItem('token'),
			},
			body: JSON.stringify(data)
		})
		.then((result) => {
			for(var j in this.refs){
				this.refs[j].setAttribute('disabled','');
			}
		});
	}
	render() {
		if (this.state.isLoaded) {
			return (
				<div>
					<ul className="list-group">


						<li className="list-group-item"><strong>Full Name</strong>
							<button className="edit-btn" onClick={e => this.refs.fn.removeAttribute('disabled')} ><i className="fas fa-edit"></i>
							</button>
							<span className="info">
								<input id='fullname' ref='ln' disabled onChange={e => this.setState({ fullname : e.target.value }) } value={this.state.fullname}/>
							</span>
						</li>
						<li className="list-group-item"><strong>Age</strong>
							<button className="edit-btn" onClick={e => this.refs.age.removeAttribute('disabled')} ><i className="fas fa-edit"></i>
							</button>
							<span className="info">
								<input id='age' ref='age' disabled onChange={e => this.setState({age: e.target.value }) } value={this.state.age}/>
							</span>
						</li>
						<li className="list-group-item"><strong>Country</strong>
							<button className="edit-btn" onClick={e => this.refs.ct.removeAttribute('disabled')} > <i className="fas fa-edit"></i>
							</button>
							<span className="info">
								<input id='country' ref='ct' disabled onChange={e => this.setState({country: e.target.value }) } value={this.state.country}/>
							</span>
						</li>
						<li className="list-group-item"><strong>Education</strong>
							<button className="edit-btn" onClick={e => this.refs.edu.removeAttribute('disabled')} ><i className="fas fa-edit"></i>
							</button>
							<span className="info">
								<input id='education' ref='edu' disabled onChange={e => this.setState({education: e.target.value }) } value={this.state.education}/>
							</span>
						</li>
						<li className="list-group-item"><strong>Bio</strong>
							<button className="edit-btn" onClick={e => this.refs.bio.removeAttribute('disabled')} ><i className="fas fa-edit"> </i>
							</button>
							<span className="info">
								<input id='bio' ref='bio' disabled onChange={e => this.setState({bio: e.target.value }) } value={this.state.bio}/>
							</span></li>
					</ul>
					<button onClick={e => this.handle_click(e,this.state)}>  Change profile</button>
				</div >
			);
		}
		else {
			return '';
		}

	}

}

export default GeneralInfo;