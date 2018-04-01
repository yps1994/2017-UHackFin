import React from 'react';

import TimeSeriesChart from './Charts/TimeSeriesChart';

export default class SummarySection extends React.Component {

  // Rendering section
  render = () => {
    // get data from state, not from props

    const portfolio_date = this.props.historyPortfolioDate;
    const portfolio_amount = this.props.historyPortfolioAmount;
  
    return (

      <div id="summary-wrapper">

        <div id="section-text">
          3. Summary <hr/>
        </div>

        <div id="summary-content">
          <div id="summary-chart">
            <TimeSeriesChart date={portfolio_date} data={portfolio_amount} />
          </div>
        </div>

      </div>
    );
  }
}