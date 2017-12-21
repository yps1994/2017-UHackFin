import React from 'react';

import { Line } from 'react-chartjs-2';

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

const options = {
  title: {
    display: true,
    fontSize: 18,
    text: 'Trend of your consolidated capital'
  },
  elements: {
    line: {
      tension: 0,
    }
  }
};


export default class SummarySection extends React.Component {

  // Rendering section
  render = () => {
    // get data from state, not from props
    const portfolio_amount = this.props.historyPortfolioAmount;
    const portfolio_date = this.props.historyPortfolioDate;

    return (
      <div id="summary-wrapper">
        <div id="section-text">
          3. Summary <hr/>
        </div>
        <div id="summary-content">
          <Line data={convertToChartData(portfolio_amount, portfolio_date)} height={80} options={options} />
        </div>
      </div>
    );
  }
}

function convertToChartData (amount, date) {
  return {
    labels: date,
    datasets: [{
      label: "Total capital",
      data: amount
    }]
  };
}
