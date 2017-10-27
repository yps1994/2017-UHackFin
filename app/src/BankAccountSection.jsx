import React from 'react';

import BankAccountTable from './BankAccount/Table';
import BankAccountChart from './BankAccount/Chart';
import BankAccountForm from './BankAccount/Form';

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

export default class BankAccountSection extends React.Component {
  constructor (props) {
    super(props);
    this.state = { accountList: [] };
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
      <div className="bankaccount-wrapper">
        <div className="col-md-6 bankaccount-table divider-right-4px">
          <BankAccountTable accountList={accountList} updateParentAccountList={this.updateBankAccountList} />
          <BankAccountForm accountList={accountList} updateParentAccountList={this.updateBankAccountList} />
        </div>
        <div className="col-md-6 bankaccount-chart">
          <BankAccountChart accountList={accountList} />
        </div>
      </div>
    );
  }
}
