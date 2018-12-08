import React from 'react';
import get_data from './Utils';
import { Doughnut } from 'react-chartjs-2';
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

		var fontSize = 0.8;
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
			chartOption: []
		};
	}

	componentDidMount() {
		get_data("/profile/api/statistic/?username=" + this.props.username, true)
			.then(res => res.json())
			.then(
				(result) => {
					var data = [];
					var option = [];
					for (let i = 0; i < result.length; i++) {
						data.push({
							labels: ["Done", "Remain"],
							datasets: [{
								data: [result[i]['counter'], 100 - result[i]['counter']],
								backgroundColor: [
									'#FF6384',
									'#36A2EB',
									'#FFCE56'
								],
								hoverBackgroundColor: [
									'#FF6384',
									'#36A2EB',
									'#FFCE56'
								]
							}],
							text: result[i]['counter'] + '%'

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
						});
					}
					console.log(data);
					this.setState({
						isLoaded: true,
						chartData: data,
						chartOption: option
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
				myStat.push(<Doughnut key={i} data={this.state.chartData[i]}  width={170} height={120} options={this.state.chartOption[i]} />)
			}
			return (
				<div style={{ position: 'relative', alignContent: "center" }}>
					{myStat}
				</div>
			);
		}
		else {
			return null;
		}

	}
}

export default StatChart;