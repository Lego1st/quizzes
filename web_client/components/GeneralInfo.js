import React from 'react';
////////////////////////////////////
// 			GENERAL INFO		  //
////////////////////////////////////

class GeneralInfo extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			data: null,
		};
	}

	componentDidMount() {
	    fetch("http://127.0.0.1:8000/api/profile/general-info")
	      .then(res => res.json())
	      .then(
	        (result) => {
	        	console.log('general-info', result);
	          this.setState({
	            isLoaded: true,
	            data: result[0]
	          });
	        },
	        // Note: it's important to handle errors here
	        // instead of a catch() block so that we don't swallow
	        // exceptions from actual bugs in components.
	        (error) => {
	          this.setState({
	            isLoaded: true,
	            error
	          });
	        }
	      )
	}

	render() {
		if (this.state.isLoaded) {
			return (
				<ul className="list-group list-group-flush">
					<li className="list-group-item"><strong>Username</strong> 
						<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['userName']}</span></li>
					<li className="list-group-item"><strong>FullName</strong> 
						<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['fullName']}</span></li>
	                <li className="list-group-item"><strong>Age</strong> 
	                	<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['age']}</span></li>
	                <li className="list-group-item"><strong>Country</strong> 
	                	<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['country']}</span></li>
	                <li className="list-group-item"><strong>Education</strong> 
	                	<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['education']}</span></li>
	                <li className="list-group-item"><strong>Bio</strong> 
	                	<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['bio']}</span></li>
	            </ul>
			);			
		}
		else {
			return null;
		}
		
	}

}

export default GeneralInfo;