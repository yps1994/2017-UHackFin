import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { range } from 'underscore';

const options = {
  title: {
    display: true,
    fontSize: 18,
    text: 'Composition of your portfolio'
  }
};

export default class Chart extends React.Component {
  render = () => {
    const chartData = convertToChartData(this.props.data);

    if (chartData.labels.length > 0) {
      return (
        <Doughnut data={chartData} options={options} />
      );
    } else {
      return (
        <div className="chart-empty-style"> Data will be visualized here.</div>
      );
    }
  }
}

function convertToChartData (data) {
  return {
    labels: data.map(function (val) {
      return val.name;
    }),

    datasets: [{
      data: data.map(function (val) {
        return val.amount;
      }),
      backgroundColor: range(data.length).map(function (i) {
        return getColor(i * 3 % 17);
      })
    }]
  };
}

// Predefined color because chartJS does not provide any color scheme
function getColor (index) {
  var color = ['#00BAF2', '#00BAF2', '#00a7d9', /* light blue */
    '#E80C60', '#E80C60', '#d00a56', /* light pink */
    '#9B26AF', '#9B26AF', '#8b229d', /* light purple */
    '#E2D51A', '#E2D51A', '#E2D51A', /* med yellow */
    '#FB301E', '#FB301E', '#e12b1b', /* med red */
    '#00AE4D', '#00AE4D', '#00AE4D']; /* med green */

  return color[index];
}
