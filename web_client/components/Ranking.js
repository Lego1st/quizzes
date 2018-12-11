import React from 'react';
import get_data from "./Utils"
import {CATEGORY_CODE} from "./Constants"
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
			console.log(CATEGORY_CODE);
			let num = 'th';
			if((rank[0] + 1) % 10 == 1){
				num = 'st';
			}
			if((rank[0] + 1) % 10 ==2){
				num = 'nd';
			}

			newData.push(<li key={key} className="list-group-item" ><strong>{CATEGORY_CODE[key]} </strong><span className="badge badge-pill badge-danger"> {rank[0] + 1}{num} </span> </li>)
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
