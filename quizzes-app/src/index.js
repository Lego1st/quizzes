import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './profile.css'
import './default.css'
import App from './App';
import * as serviceWorker from './serviceWorker';

/////////////////////////////////
// 			POLARCHART	  	   //
/////////////////////////////////
var PolarAreaChart = require("react-chartjs").PolarArea;

var chartOptions = {
	//Boolean - Show a backdrop to the scale label
	scaleShowLabelBackdrop : true,

	//String - The colour of the label backdrop
	scaleBackdropColor : "rgba(255,255,255,0.75)",

	// Boolean - Whether the scale should begin at zero
	scaleBeginAtZero : true,

	//Number - The backdrop padding above & below the label in pixels
	scaleBackdropPaddingY : 2,

	//Number - The backdrop padding to the side of the label in pixels
	scaleBackdropPaddingX : 2,

	//Boolean - Show line for each value in the scale
	scaleShowLine : true,

	//Boolean - Stroke a line around each segment in the chart
	segmentShowStroke : true,

	//String - The colour of the stroke on each segment.
	segmentStrokeColor : "#fff",

	//Number - The width of the stroke value in pixels
	segmentStrokeWidth : 2,

	//Number - Amount of animation steps
	animationSteps : 100,

	//String - Animation easing effect.
	animationEasing : "easeOutBounce",

	//Boolean - Whether to animate the rotation of the chart
	animateRotate : true,

	//Boolean - Whether to animate scaling the chart from the centre
	animateScale : false,
	//String - A legend template
	legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"
}

var chartDataSample = [
	{
		value: 300,
		color:"#F7464A",
		highlight: "#FF5A5E",
		label: "Red"
	},
	{
		value: 50,
		color: "#46BFBD",
		highlight: "#5AD3D1",
		label: "Green"
	},
	{
		value: 100,
		color: "#FDB45C",
		highlight: "#FFC870",
		label: "Yellow"
	}
]

var myWidth = 500;
var myHeight = 500;

class MyChart extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			chartData: null,
		};
	}

	componentDidMount() {
	    fetch("http://localhost:5000/chart")
	      .then(res => res.json())
	      .then(
	        (result) => {
	        	console.log(result.fetch_data);
	          this.setState({
	            isLoaded: true,
	            chartData: result.fetch_data
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
			<PolarAreaChart data={this.state.chartData} options={chartOptions} width = {myWidth} height = {myHeight} redraw = {true}/>
			);			
		}
		else {
			return null;
		}
		
	}


}

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
	    fetch("http://localhost:5000/info")
	      .then(res => res.json())
	      .then(
	        (result) => {
	        	console.log(result.fetch_data);
	          this.setState({
	            isLoaded: true,
	            data: result.fetch_data
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
	                <li className="list-group-item"><strong>Age</strong> <span className="info">{this.state.data['age']}</span></li>
	                <li className="list-group-item"><strong>Country</strong> <span className="info">{this.state.data['country']}</span></li>
	                <li className="list-group-item"><strong>Education</strong> <span className="info">{this.state.data['edu']}</span></li>
	                <li className="list-group-item"><strong>Bio</strong> <span className="info">{this.state.data['bio']}</span></li>
	            </ul>
			);			
		}
		else {
			return null;
		}
		
	}

}

////////////////////////////////////
// 			RANKING INFO		  //
////////////////////////////////////

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
		for (var key in fetch_data) {
			newData.push(<li key ={key} className="list-group-item"><strong>{key}</strong> <span className="badge badge-primary">{fetch_data[key]}</span> </li>)
		}

		this.setState({
			isLoaded: true,
			data: newData,
		})
		
	}

	componentDidMount() {
	    fetch("http://localhost:5000/rank")
	      .then(res => res.json())
	      .then(
	        (result) => {
	        	this.handleData(result.fetch_data);
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

ReactDOM.render(<GeneralInfo />, document.getElementById('info'));
ReactDOM.render(<MyChart />, document.getElementById('chart'));
ReactDOM.render(<Ranking />, document.getElementById('rank'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
