import React from 'react';
import moment from 'moment';
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
          <div id="summary-chart">
            <ResponsiveContainer>
              <AreaChart data={convertToChartData(portfolio_date, portfolio_amount) }>
                <Area type="monotone" dataKey="Amount" />
                <XAxis
                  name = "Date"
                  domain = {['dataMin', 'dataMax']}
                  dataKey = "UnixTime"
                  tickSize = {15}
                  tickFormatter = {(unixTime) => convertUnixTimeToDate(unixTime)}
                  type = "number"
                />
                <YAxis
                  width = {100}
                  domain = {['auto', 'auto']}
                  tickSize = {15}
                  tickFormatter = {(amount) => toMoneyFormat(amount)}
                />
                <Tooltip
                  formatter = {(amount) => toMoneyFormat(amount)}
                  labelFormatter = {(unixTime) => convertUnixTimeToDate(unixTime)}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    );
  }
}

const toMoneyFormat = (amount) => { return "$"+parseFloat(amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); }
const convertUnixTimeToDate = (unixTime) => { return (moment(unixTime)).format('YYYY-MM-DD'); }

function convertToChartData (date, amount) {
  var result = [];
  date.forEach((date, i) => result.push({UnixTime: Date.parse(date), Amount: amount[i]}));
  return result;
}