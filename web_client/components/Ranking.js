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
		
		for (let key in fetch_data) {
			let rank = fetch_data[key];
			console.log(rank);
			newData.push(<li key={key} className="list-group-item"><strong>{rank[0] + 1}</strong> <span className="badge badge-primary">{rank[1]}</span> </li>)
		}

		this.setState({
			isLoaded: true,
			data: newData,
		})
		
	}

	componentDidMount() {
	    get_data("/profile/api/ranking/?username="+this.props.username,true)
	      .then(res => res.json())
	      .then(
	        (result) => {
					console.log("statistic:", result);
					
	        this.handleData(result);
	        },
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
