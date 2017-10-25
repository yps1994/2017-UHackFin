import React from 'react';
import {Doughnut} from 'react-chartjs-2'

const options = {
  title: {
    display: true,
    fontSize: 18,
    text: 'Composition of your portfolio'
  }
}


export default class BankAccountChart extends React.Component {

  render = () => {

    const chartData = convertListAccountData(this.props.accountList);

    if (chartData.labels.length > 0) {
      return (
        <Doughnut data={chartData} options={options} />
      );
    }
    else {
      return (
        <div className="bankaccount-chart-empty-style"> Data will be visualized here.</div>
      );
    }
  }
}


//Peter Yeung: The conversion is terribly troublesome. You have to deal with syntax of array and list respectively.
//https://github.com/jerairrest/react-chartjs-2
function convertListAccountData(listAccount) {

  var i;
  var chartObject = {};
      chartObject.labels = [];
      chartObject.datasets = [];
  var tempData = {};
      tempData.data = [];
      tempData.backgroundColor = [];

  for (i = 0; i < listAccount.length; ++i) {
    chartObject.labels.push(listAccount[i]['name']);
    tempData.data.push(listAccount[i]['amount']);
    tempData.backgroundColor.push(getColor(i * 3 % 17));
  }

  chartObject.datasets.push(tempData);

  return chartObject;
}


//Predefined color because chartJS does not provide any color scheme.........
function getColor(index) {
  var color = ['#00BAF2', '#00BAF2', '#00a7d9', /* light blue */
  '#E80C60', '#E80C60', '#d00a56', /* light pink */
  '#9B26AF', '#9B26AF', '#8b229d', /* light purple */
  '#E2D51A', '#E2D51A', '#E2D51A', /* med yellow */
  '#FB301E', '#FB301E', '#e12b1b', /* med red */
  '#00AE4D', '#00AE4D', '#00AE4D']; /* med green */

  return color[index];
}