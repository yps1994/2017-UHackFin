import React from 'react';

import BankAccountTable from './BankAccount/Table';
import StockForm from './Stock/Form';
import Chart from './Common/Chart';


// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

export default class BankAccountSection extends React.Component {

  // Rendering section
  render = () => {
    // get data from state, not from props
    const stockList = this.props.stockList;

    return (
      <div>
        <div id="section-text">
          2. Bank Account <hr/>
        </div>
        <div id="stock-content">
          <div className="col-md-6 bankaccount-table divider-right-4px">
            
            <StockForm stockList={stockList} updateParentStockList={this.props.updateParentStockList} />
          </div>
          <div className="col-md-6 bankaccount-chart">
            <Chart data={stockList} />
          </div>
        </div>
      </div>
    );
  }
}
