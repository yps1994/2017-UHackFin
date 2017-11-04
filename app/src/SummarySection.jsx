import React from 'react';

import { Line } from 'react-chartjs-2';
import { range } from 'underscore';

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

export default class BankAccountSection extends React.Component {

  // Rendering section
  render = () => {
    // get data from state, not from props
    const portfolio_sum = this.props.historyPortfolioAmount;

    return (
      <div id="summary-wrapper">
        <div id="section-text">
          3. Summary <hr/>
        </div>
        <div id="summary-content">
          <Line data={convertToChartData(this.props.historyPortfolioAmount)} />
        </div>
      </div>
    );
  }
}

function convertToChartData (data) {
  console.log(data);
  return {
    labels: [],
    datasets: data
  };
}
