import React from 'react';

import StockTable from './Stock/Table';
import StockForm from './Stock/Form';
import Chart from './Common/Chart';


export default class StockSection extends React.Component {

  // Rendering section
  render = () => {
    // get data from state, not from props
    const stockList = this.props.stockList;
    const user_id = this.props.user_id;

    return (
      <div id="stock-wrapper">
        <div id="section-text">
          2. Stock Portfolio &amp; Risk Indicator <hr/>
        </div>
        <div id="stock-content">
          <div className="stock-table">
            <StockTable user_id={user_id} stockList={stockList} updateParentStockList={this.props.updateParentStockList} />
            Total invested amount: $ {}
          </div>
            <div className="col-md-6 stock-form divider-right-4px">
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
