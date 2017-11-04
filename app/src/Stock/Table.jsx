import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class StockTable extends React.Component {

  updateChildStockList = (stockList, row, cellName, cellValue) => {
    var index = stockList.findIndex(i => i.name === row.name);
    stockList[index][cellName] = cellValue;
    stockList[index]['earn'] = (stockList[index]['currentPrice'] - stockList[index]['buyingPrice']) * stockList[index]['shares'];
    stockList[index]['amount'] = (stockList[index]['currentPrice'] * stockList[index]['shares']);

    return (stockList);
  }

  onAfterSaveCell = (row, cellName, cellValue) => {
    this.props.updateParentStockList(this.updateChildStockList(this.props.stockList, row, cellName, cellValue));
  }

  onAfterDeleteRow = (key) => {

    let stockList = this.props.stockList;
    for (let j = 0; j < key.length; ++j) {
      var index = stockList.findIndex(i => i.id === key[j]);

      // If the index cannot be found (which supposed it won't happen)
      if (index !== -1) {
        let customDbObjectToDelete = { 
          user_id: this.props.user_id,
          stock_code: stockList[index]['code'],
          stock_share: stockList[index]['shares']
        }

        stockList.splice(index, 1);
      }
    }

    
    this.props.updateParentStockList(stockList);
  }

  csvFormatter (cell, row) {
    return `${row.id}: ${cell}`;
  }

  moneyFormatter (cell, row) {
    var formattedVal = parseFloat(cell).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    return `$ ${formattedVal}`;
  }
  // Rendering section
  render = () => {
    // Obtain stock data from parent component
    const listStock = this.props.stockList;

    // Options for cell edit
    const cellEditProp = {
      mode: 'click',
      blurToSave: true,
      afterSaveCell: this.onAfterSaveCell
    };

    // Options for mode on selecting rows
    const selectRowProp = {
      mode: 'checkbox'
    };

    // Hooking the operation of dropping rows
    const options = {

      page: 1,
      sizePerPageList: [ {
        text: '5', value: 5
      } ],
      sizePerPage: 5, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      paginationPosition: 'top', // default is bottom, top and both is all available
      afterDeleteRow: this.onAfterDeleteRow
    };

    return (

      <BootstrapTable data={listStock} cellEdit={cellEditProp} selectRow={selectRowProp} options={options}
        deleteRow exportCSV pagination striped hover condensed>
        <TableHeaderColumn isKey={true} dataField='id' dataSort> ID </TableHeaderColumn>
        <TableHeaderColumn dataField='code' dataSort editable={false}> Stock Code</TableHeaderColumn>
        <TableHeaderColumn dataField='name' dataSort editable={false}> Stock Name</TableHeaderColumn>
        <TableHeaderColumn dataField='tradingDay' dataSort editable={false}> Trading Day </TableHeaderColumn>
        <TableHeaderColumn dataField='shares' dataSort> Deposits (Shares) </TableHeaderColumn>
        <TableHeaderColumn dataField='buyingPrice' dataSort editable={{validator: amountValidator}} dataFormat={this.moneyFormatter}> Buying Price</TableHeaderColumn>
        <TableHeaderColumn dataField='currentPrice' dataSort dataFormat={this.moneyFormatter}> Current Price </TableHeaderColumn>
        <TableHeaderColumn dataField='earn' dataSort dataFormat={this.moneyFormatter} editable={false}> Earn/Loss </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

function amountValidator(amount) {
  
    var parsedAmount = parseFloat(amount, 10);
    
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount < 0) {
      return "Amount must be greater than or equal to 0.";
    }
  
    return true;
}