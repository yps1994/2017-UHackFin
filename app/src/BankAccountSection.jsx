import React from 'react';

import BankAccountTable from './BankAccount/Table';
import BankAccountForm from './BankAccount/Form';

import Chart from './Common/Chart';

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

export default class BankAccountSection extends React.Component {

  // Rendering section
  render = () => {
    // get data from state, not from props
    const accountList = this.props.accountList;

    return (
      <div id="bankaccount-wrapper">
        <div id="section-text">
          1. Bank Account <hr/>
        </div>
        <div id="bankaccount-content">
          <div className="col-md-6 bankaccount-table divider-right-4px">
            <BankAccountTable accountList={accountList} updateParentAccountList={this.props.updateParentAccountList} />
            <BankAccountForm accountList={accountList} updateParentAccountList={this.props.updateParentAccountList} />
          </div>
          <div className="col-md-6 bankaccount-chart">
            <Chart data={accountList} />
          </div>
        </div>
      </div>
    );
  }
}
