import React from 'react';

import StockTable from './Stock/Table';
import StockRiskTable from './Stock/RiskTable';
import StockForm from './Stock/Form';

import DoughnutChart from './Charts/DoughnutChart';


export default class StockSection extends React.Component {

  obtainTotalInvestedAmount = (arr) => {
    
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
            <div className="well well-sm pull-right text-right display-summary-box"> <h3>
                Total invested: $ {this.obtainTotalInvestedAmount(stockList)
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
            </h3> </div>

            <StockRiskTable user_id={user_id} stockList={stockList} />
          </div>

          <div className="row">
              <div className="col-md-6 stock-form divider-right-4px">
              <StockForm stockList={stockList} updateParentStockList={this.props.updateParentStockList} />
            </div>
            <div className="col-md-6 bankaccount-chart">
              <DoughnutChart data={stockList} />
            </div>
          </div>

        </div>
      </div>
    );
  }
}
