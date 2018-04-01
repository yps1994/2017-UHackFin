import React from 'react';
import axios from 'axios';

import {_} from 'underscore';

import BankAccountSection from './BankAccountSection';
import StockSection from './StockSection';
import StockSimilaritySection from './SimilaritySection'; 
import SummarySection from './SummarySection';

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

export default class Portfolio extends React.Component {
  constructor (props) {
    super(props);
    this.state = { 
      user_id: 1,
      portfolio_amount: [193000, 200000, 210000, 200300, 206500],
      portfolio_date: ["2017-10-07","2017-10-14","2017-10-21","2017-10-28", "2017-11-16"],
      accountList: [
        {
          name: 'Bank Of China',
          amount: 50000
        },
        {
          name: 'HSBC',
          amount: 30000
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
        hotness:0.087,
        max_drawdown: 13.0869,
        beta: 0.0018,
        variance: 15.7128,
        average_per: 6.9307,
        mean_ratio: 27.5244
      },
      {
        id: 2,
        code: '0005.HK',
        name: 'HSBC HOLDINGS',
        tradingDay: '2017-10-30',
        shares: 500,
        buyingPrice: 77.05,
        currentPrice: 75.6,
        earn: -725,
        amount: 38525,
        hotness:0.087,
        max_drawdown: 10.4348,
        beta: 0.0028,
        variance: 35.3712,
        average_per: 6.9307,
        mean_ratio: 22.8506
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
        hotness:0.093,
        max_drawdown: 7.9125,
        beta: 0.0021,
        variance: 17.2304,
        average_per: 11.8811,
        mean_ratio: 19.7962
      }]
    };
  }

  // This function is a middle-man between different DOM.
  updateBankAccountList = (updatedAccountList) => {
    this.setState({accountList: updatedAccountList});
    this.updateCurrentDay();
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

    this.updateCurrentDay();
  }

  updateCurrentDay = () => {
    /*var investedAmount = this.obtainTotalInvestedAmount(this.state.stockList);
    var bankAmount = this.obtainTotalBankAmount(this.state.accountList);

    const portfolioAmount = this.state.portfolio_amount;
    portfolioAmount[4] = investedAmount + bankAmount;

    this.setState({portfolio_amount: portfolioAmount});*/
    
  }

  obtainTotalInvestedAmount = (arr) => {
    
    return arr.reduce((total, obj) => {
      if (typeof obj['amount'] === 'string') {
        return total + Number(obj['amount']);
      }
      return total + obj['amount'];
    }, 0);
  }

  obtainTotalBankAmount = (arr) => {
    
    return arr.reduce((total, obj) => {
      if (typeof obj['amount'] === 'string') {
        return total + Number(obj['amount']);
      }
      return total + obj['amount'];
    }, 0);
  }


  // Rendering section
  render = () => {
    // get data from state, not from props
    const accountList = this.state.accountList;
    const stockList = this.state.stockList;
    const user_id = this.state.user_id;
    const portfolio_amount = this.state.portfolio_amount;
    const portfolio_date = this.state.portfolio_date;
    return (
      <div>
          <BankAccountSection user_id={user_id} accountList={accountList} updateParentAccountList={this.updateBankAccountList} />
          <StockSection user_id={user_id} stockList={stockList} updateParentStockList={this.updateStockList} />
          <StockSimilaritySection user_id={user_id} stockList={stockList} />
          <SummarySection user_id={user_id} historyPortfolioAmount={portfolio_amount} historyPortfolioDate={portfolio_date} />
      </div>
    );
  }
}
