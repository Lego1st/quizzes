// import React from 'react';
// import ReactDOM from 'react-dom';
// import * as serviceWorker from './serviceWorker';

// /////////////////////////////////
// // 			POLARCHART	  	   //
// /////////////////////////////////
// var PolarAreaChart = require("react-chartjs").PolarArea;

// var chartOptions = {
// 	//Boolean - Show a backdrop to the scale label
// 	scaleShowLabelBackdrop : true,

// 	//String - The colour of the label backdrop
// 	scaleBackdropColor : "rgba(255,255,255,0.75)",

// 	// Boolean - Whether the scale should begin at zero
// 	scaleBeginAtZero : true,

// 	//Number - The backdrop padding above & below the label in pixels
// 	scaleBackdropPaddingY : 2,

// 	//Number - The backdrop padding to the side of the label in pixels
// 	scaleBackdropPaddingX : 2,

// 	//Boolean - Show line for each value in the scale
// 	scaleShowLine : true,

// 	//Boolean - Stroke a line around each segment in the chart
// 	segmentShowStroke : true,

// 	//String - The colour of the stroke on each segment.
// 	segmentStrokeColor : "#fff",

// 	//Number - The width of the stroke value in pixels
// 	segmentStrokeWidth : 2,

// 	//Number - Amount of animation steps
// 	animationSteps : 100,

// 	//String - Animation easing effect.
// 	animationEasing : "easeOutBounce",

// 	//Boolean - Whether to animate the rotation of the chart
// 	animateRotate : true,

// 	//Boolean - Whether to animate scaling the chart from the centre
// 	animateScale : false,
// 	//String - A legend template
// 	legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"
// }

// var colors = ["#F7464A", "#46BFBD", "#FDB45C", "#NTL22H"]

// var myWidth = 400;
// var myHeight = 400;

// class MyChart extends React.Component{
// 	constructor(props){
// 		super(props);
// 		this.state = {
// 			error: null,
// 			isLoaded: false,
// 			chartData: null,
// 		};
// 	}

// 	componentDidMount() {
// 	    fetch("api/profile/statistic")
// 	      .then(res => res.json())
// 	      .then(
// 	        (result) => {
//         	 	var data = [];
// 				for (let i = 0; i < result.length; i++) {
// 					data.push({
// 						value: result[i]['counter'],
// 						color: colors[i % colors.length],
// 						highlight: colors[i % colors.length],
// 						label: result[i]['course']
// 					});
// 				}

// 	          this.setState({
// 	            isLoaded: true,
// 	            chartData: data
// 	          });
// 	        },
// 	        // Note: it's important to handle errors here
// 	        // instead of a catch() block so that we don't swallow
// 	        // exceptions from actual bugs in components.
// 	        (error) => {
// 	          this.setState({
// 	            isLoaded: true,
// 	            error
// 	          });
// 	        }
// 	      )
// 	}

// 	render() {
// 		if (this.state.isLoaded) {
// 			return (
// 			<PolarAreaChart data={this.state.chartData} options={chartOptions} width = {myWidth} height = {myHeight} redraw = {true}/>
// 			);			
// 		}
// 		else {
// 			return null;
// 		}
		
// 	}


// }

// ////////////////////////////////////
// // 			GENERAL INFO		  //
// ////////////////////////////////////

// class GeneralInfo extends React.Component {
// 	constructor(props){
// 		super(props);
// 		this.state = {
// 			error: null,
// 			isLoaded: false,
// 			data: null,
// 		};
// 	}

// 	componentDidMount() {
// 	    fetch("api/profile/general-info")
// 	      .then(res => res.json())
// 	      .then(
// 	        (result) => {
// 	        	console.log('general-info', result);
// 	          this.setState({
// 	            isLoaded: true,
// 	            data: result[0]
// 	          });
// 	        },
// 	        // Note: it's important to handle errors here
// 	        // instead of a catch() block so that we don't swallow
// 	        // exceptions from actual bugs in components.
// 	        (error) => {
// 	          this.setState({
// 	            isLoaded: true,
// 	            error
// 	          });
// 	        }
// 	      )
// 	}

// 	render() {
// 		if (this.state.isLoaded) {
// 			return (
// 				<ul className="list-group list-group-flush">
// 					<li className="list-group-item"><strong>Username</strong> 
// 						<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['userName']}</span></li>
// 					<li className="list-group-item"><strong>FullName</strong> 
// 						<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['fullName']}</span></li>
// 	                <li className="list-group-item"><strong>Age</strong> 
// 	                	<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['age']}</span></li>
// 	                <li className="list-group-item"><strong>Country</strong> 
// 	                	<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['country']}</span></li>
// 	                <li className="list-group-item"><strong>Education</strong> 
// 	                	<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['education']}</span></li>
// 	                <li className="list-group-item"><strong>Bio</strong> 
// 	                	<i className="fas edit-btn fa-edit"></i> <span className="info">{this.state.data['bio']}</span></li>
// 	            </ul>
// 			);			
// 		}
// 		else {
// 			return null;
// 		}
		
// 	}

// }

// ////////////////////////////////////
// // 			RANKING INFO		  //
// ////////////////////////////////////

// class Ranking extends React.Component {
// 	constructor(props){
// 		super(props);
// 		this.state = {
// 			error: null,
// 			isLoaded: false,
// 			data: [],
// 		};
// 	}

// 	handleData(fetch_data) {
// 		let newData = [];
		
// 		console.log(newData);
// 		for (let i = 0; i < fetch_data.length; i++) {
// 			let key = fetch_data[i];
// 			newData.push(<li key ={key['id']} className="list-group-item"><strong>{key['course']}</strong> <span className="badge badge-primary">{key['counter']}</span> </li>)
// 		}

// 		this.setState({
// 			isLoaded: true,
// 			data: newData,
// 		})
		
// 	}

// 	componentDidMount() {
// 	    fetch("api/profile/statistic")
// 	      .then(res => res.json())
// 	      .then(
// 	        (result) => {
// 	        console.log("statistic:", result);
// 	        	this.handleData(result);
// 	        },
// 	        // Note: it's important to handle errors here
// 	        // instead of a catch() block so that we don't swallow
// 	        // exceptions from actual bugs in components.
// 	        (error) => {
// 	          this.setState({
// 	            isLoaded: true,
// 	            error
// 	          });
// 	        }
// 	      )
// 	}

// 	render() {
// 		if (this.state.isLoaded) {
// 			return (
// 			<ul className="list-group list-group-flush">
//                 {this.state.data}
//               </ul>
// 			);
// 		}
// 		else {
// 			return null;
// 		}
		
// 	}

// }

// ReactDOM.render(<GeneralInfo />, document.getElementById('info'));
// ReactDOM.render(<MyChart />, document.getElementById('chart'));
// ReactDOM.render(<Ranking />, document.getElementById('rank'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React, { Component } from 'react';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Profile
      </div>
    );
  }
}

export default Profile;
