import React from 'react';

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

var colors = ["#F7464A", "#46BFBD", "#FDB45C", "#5985cc"]

var myWidth = 400;
var myHeight = 400;

var Config = require('Config');

class StatChart extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			chartData: null,
		};
	}

	componentDidMount() {
	    fetch(Config.serverUrl + "/api/profile/statistic")
	      .then(res => res.json())
	      .then(
	        (result) => {
        	 	var data = [];
				for (let i = 0; i < result.length; i++) {
					data.push({
						value: result[i]['counter'],
						color: colors[i % colors.length],
						highlight: colors[i % colors.length],
						label: result[i]['course']
					});
				}

	          this.setState({
	            isLoaded: true,
	            chartData: data
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

export default StatChart;