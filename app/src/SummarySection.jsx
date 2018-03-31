import React from 'react';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

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
          <ResponsiveContainer minHeight={300}>
            <AreaChart data={convertToChartData(portfolio_date, portfolio_amount) }>
              <Area type="monotone" dataKey="Amount" />
              <XAxis dataKey="Date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    );
  }
}

function convertToChartData (date, amount) {
  var result = [];

  date.forEach((date, i) => result.push({Date: date, Amount: amount[i]}));

  return result;
}