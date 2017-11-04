import React from 'react';
import axios from 'axios';
import {_} from 'underscore';
import BankAccountSection from './BankAccountSection';
import StockSection from './StockSection';
import SummarySection from './SummarySection';

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

export default class Portfolio extends React.Component {
  constructor (props) {
    super(props);
    this.state = { 
      user_id: 1,
      portfolio_amount: [193000, 200000, 210000, 200300],
      accountList: [
        {
          name: 'Bank Of China',
          amount: '50000'
        },
        {
          name: 'HSBC',
          amount: '30000'
        }],
      stockList: [{
        id: 1,
        code: '0001.HK',
        name: 'CKH HOLDINGS',
        tradingDay: '2017-10-31',
        shares: 500,
        buyingPrice: 98.75,
        currentPrice: 99.15,
        earn: 200,
        amount: 49375,
        hotness:0.087
      },
      {
        id: 2,
        code: '0700.HK',
        name: 'TENCENT',
        tradingDay: '2017-10-30',
        shares: 100,
        buyingPrice: 349,
        currentPrice: 368,
        earn: 1900,
        amount: 34900,
        hotness:0.0117
      },
      {
        id: 3,
        code: '2388.HK',
        name: 'BOC HONG KONG',
        tradingDay: '2017-10-13',
        shares: 1000,
        buyingPrice: 38.6,
        currentPrice: 38.55,
        earn: -50,
        amount: 38600,
        hotness:0.093
      }]
    };
  }

  // This function is a middle-man between different DOM.
  updateBankAccountList = (updatedAccountList) => {
    this.setState({accountList: updatedAccountList});
  }

  updateStockList = (updatedStockList) => {
    this.setState({stockList: updatedStockList});

    var grouppedStockCodeList = _(this.state.stockList).groupBy('code');
    var grouppedStockSharesList = _(grouppedStockCodeList).map(function(grouppedValue,key) {
      return {
        user_id: String(this.state.user_id),
        stock_code: String(key),
        stock_share: String(_(grouppedValue).reduce(function (m, x) { return m + x.shares; }, 0))
      };
    }, this);

    grouppedStockSharesList.forEach(function (item) {
      axios.post('http://143.89.19.10:3000/stocks/post', [item])
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  // Rendering section
  render = () => {
    // get data from state, not from props
    const accountList = this.state.accountList;
    const stockList = this.state.stockList;
    const user_id = this.state.user_id;
    const portfolio_sum = this.state.portfolio_sum;
    return (
      <div>
          <BankAccountSection user_id={user_id} accountList={accountList} updateParentAccountList={this.updateBankAccountList} />
          <StockSection user_id={user_id} stockList={stockList} updateParentStockList={this.updateStockList} />
          
      </div>
    );
  }
}
