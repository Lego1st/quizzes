import React from 'react';
import get_data from './Utils';
import { Doughnut, Bar } from 'react-chartjs-2';
// import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js'
import { CATEGORY_CODE } from './Constants';

// var Pie = require('react-charjs-2').Pie;
var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
	draw: function () {
		originalDoughnutDraw.apply(this, arguments);

		var chart = this.chart;
		var width = chart.chart.width,
			height = chart.chart.height,
			ctx = chart.chart.ctx;

		var fontSize = 1.5;
		ctx.font = fontSize + "em sans-serif";
		ctx.textBaseline = "middle";

		var text = chart.config.data.text,
			textX = Math.round((width - ctx.measureText(text).width) / 2),
			textY = Math.round(height / 2.5);

		ctx.fillText(text, textX, textY);
	}
});

var chartOptions = {
	maintainAspectRatio: false,
	responsive: false,
	title: {
		position: "bottom",
		text: "Math",
		display: true
	},
	legend: {
		display: false
	}

}

var colors = ["#F7464A", "#46BFBD", "#FDB45C", "#5985cc"]

var Config = require('Config');

class StatChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			chartData: [],
			chartOption: [],
			barData: '',
			rankData: {}
		};
	}

	componentDidMount() {
		get_data("/profile/api/ranking/?username="+this.props.username,true)
		.then(res => res.json())
		.then(
		  (result) => {
				console.log("statistic:", result);
				  
		  		this.setState({rankData: result})
		  },
		)
		get_data("/profile/api/statistic/?username=" + this.props.username, true)
			.then(res => res.json())
			.then(
				(results) => {
					var data = [];
					var option = [];
					var result = results['per_cate'];
					for (let i = 0; i < result.length; i++) {
						try{
						let rank = this.state.rankData[result[i]['cate']];

						let num = 'th';
						if((rank[0] + 1) % 10 == 1){
							num = 'st';
						}
						if((rank[0] + 1) % 10 ==2){
							num = 'nd';
						}
						data.push({
							labels: ["Done", "Remain"],
							datasets: [{
								data: [result[i]['counter'], 100 - result[i]['counter']],
								backgroundColor: [
									colors[i],
									colors[i + 1]
								],
								hoverBackgroundColor: [
									'#FF6384',
									'#36A2EB'

								]
							}],
							text: rank[0] + 1 + num,

						});
						option.push({
							maintainAspectRatio: false,
							responsive: false,
							title: {
								position: "bottom",
								text: CATEGORY_CODE[result[i]['cate']],
								display: true
							},
							legend: {
								display: false
							},
							cutoutPercentage: 70,
						});}catch{
							
						}
					}
					var result2 = results['per_mon']
					var data2 = {
						labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
							'August', 'September', 'October', 'Novemver', 'December'],
						datasets: [
							{
								label: 'Quiz done each months',
								backgroundColor: 'rgba(54,162,235,1)',
								borderColor: 'rgba(54,162,235,0.4)',
								borderWidth: 1,
								hoverBackgroundColor: 'rgba(54,162,235,0.8)',
								hoverBorderColor: 'rgba(54,162,235,0.8)',
								data: results['per_mon']
							}
						]
					}
					this.setState({
						isLoaded: true,
						chartData: data,
						chartOption: option,
						barData: data2,
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
			const myStat = []
			for (var i = 0; i < this.state.chartData.length; i++) {
				myStat.push(<Doughnut key={i} data={this.state.chartData[i]} redraw={true} width={200} 
						height={200} options={this.state.chartOption[i]}/>)
			}
			return (
				<div style={{ backgroundColor: "#ffffff" }} >
					<div style={{ position: 'relative', textAlign: "center", padding: "40px" }}>
						{myStat}
					</div>
					<div>
						<Bar redraw={true} data={this.state.barData} />
					</div>
				</div>
			);
		}
		else {
			return null;
		}

	}
}

export default StatChart;