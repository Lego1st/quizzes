import React from 'react';
import get_data from "./Utils"
// ////////////////////////////////////
// // 			RANKING INFO		  //
// ////////////////////////////////////

var Config = require('Config');

class Ranking extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			data: [],
		};
	}

	handleData(fetch_data) {
		let newData = [];
		
		console.log(newData);
		for (let i = 0; i < fetch_data.length; i++) {
			let key = fetch_data[i];
			newData.push(<li key ={key['id']} className="list-group-item"><strong>{key['course']}</strong> <span className="badge badge-primary">{key['counter']}</span> </li>)
		}

		this.setState({
			isLoaded: true,
			data: newData,
		})
		
	}

	componentDidMount() {
	    get_data("/api/profile/statistic/",true)
	      .then(res => res.json())
	      .then(
	        (result) => {
	        console.log("statistic:", result);
	        	this.handleData(result);
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
                {this.state.data}
              </ul>
			);
		}
		else {
			return null;
		}
		
	}

}

export default Ranking;
