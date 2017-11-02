import React from 'react';

import BankAccountSection from './BankAccountSection';

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

  // Rendering section
  render = () => {
    // get data from state, not from props
    const accountList = this.state.accountList;

    return (
      <BankAccountSection accountList={accountList} updateParentAccountList={this.updateBankAccountList} />
    );
  }
}
