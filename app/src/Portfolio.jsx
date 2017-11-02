import React from 'react';

import BankAccountSection from './BankAccountSection';
import StockSection from './StockSection';

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

export default class Portfolio extends React.Component {
  constructor (props) {
    super(props);
    this.state = { 
      accountList: [],
      stockList: []
    };
  }

  // This function is a middle-man between different DOM.
  updateBankAccountList = (updatedAccountList) => {
    this.setState({accountList: updatedAccountList});
  }

  updateStockList = (updatedStockList) => {
    this.setState({stockList: updatedStockList});
  }

  // Rendering section
  render = () => {
    // get data from state, not from props
    const accountList = this.state.accountList;
    const stockList = this.state.stockList;

    return (
      <div>
        <div>
          <BankAccountSection accountList={accountList} updateParentAccountList={this.updateBankAccountList} />
        </div>
        <StockSection stockList={stockList} updateParentStockList={this.updateStockList} />
      </div>
    );
  }
}
