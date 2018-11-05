import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './profile.css'
import './default.css'
import App from './App';
import * as serviceWorker from './serviceWorker';

var PieChart = require("react-chartjs").Pie;

var chartOptions = {
	//Boolean - Whether we should show a stroke on each segment
	segmentShowStroke : true,

	//String - The colour of each segment stroke
	segmentStrokeColor : "#fff",

	//Number - The width of each segment stroke
	segmentStrokeWidth : 3,

	//Number - The percentage of the chart that we cut out of the middle
	percentageInnerCutout : 30, // This is 0 for Pie charts

	//Number - Amount of animation steps
	animationSteps : 100,

	//String - Animation easing effect
	animationEasing : "easeOutBounce",

	//Boolean - Whether we animate the rotation of the Doughnut
	animateRotate : true,

	//Boolean - Whether we animate scaling the Doughnut from the centre
	animateScale : false,

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

class MyComponent extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			chartData: null,
		};
	}

	componentDidMount() {
	    fetch("http://localhost:5000/test")
	      .then(res => res.json())
	      .then(
	        (result) => {
	        	console.log(result);
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
	  return (
	     <PieChart data={this.state.chartData} options={chartOptions}/>
	  );
		
	}


}

ReactDOM.render(<MyComponent />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
