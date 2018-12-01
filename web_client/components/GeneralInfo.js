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
	componentDidMount() {

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
	handle_click = (e, data) => {
		fetch(Config.serverUrl + '/profile/api/update/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + localStorage.getItem('token'),
			},
			body: JSON.stringify(data)
		})
			.then((result) => {
				for (var j in this.refs) {
					this.refs[j].setAttribute('disabled', '');
				}
			});
	}
	render() {
		if (this.state.isLoaded) {
			return (
				<div>
					<ul className="list-group">

						<li className="list-group-item"><strong>Full Name</strong>
							<span className="info">
								<input id='fullname' ref='fn' disabled={!this.props.is_editing} onChange={e => this.setState({ fullname: e.target.value })} value={this.state.fullname} />
							</span>
						</li>
						<li className="list-group-item"><strong>Age</strong>
							<span className="info">
								<input id='age' ref='age' disabled={!this.props.is_editing} onChange={e => this.setState({ age: e.target.value })} value={this.state.age} />
							</span>
						</li>
						<li className="list-group-item"><strong>Country</strong>

							<span className="info">
								<input id='country' list="countries" ref='ct' disabled={!this.props.is_editing} onFocus={e => e.target.value = ''} onChange={e => this.setState({ country: e.target.value })} value={this.state.country} />
								<datalist id="countries">
									<option value="Vietnam" />
									<option value="England" />
									<option value="America" />
									<option value="Japan" />
								</datalist>
							</span>
						</li>
						<li className="list-group-item"><strong>Education</strong>

							<span className="info">
								<input id='education' ref='edu' disabled={!this.props.is_editing} onChange={e => this.setState({ education: e.target.value })} value={this.state.education} />
							</span>
						</li>
						<li className="list-group-item"><strong>Bio</strong>

							<span className="info">
								<input id='bio' ref='bio' disabled={!this.props.is_editing} onChange={e => this.setState({ bio: e.target.value })} value={this.state.bio} />
							</span></li>

					</ul>
					<div style={{ marginTop: 5 + 'px' }}>
						{this.props.username != localStorage.getItem('username') ? '' :
							<button className='btn btn-primary btn-profile' id='savebtn' onClick={e => this.handle_click(e, this.state)}>Save</button>
						}
					</div>
				</div >
			);
		}
		else {
			return '';
		}

	}

}

export default GeneralInfo;