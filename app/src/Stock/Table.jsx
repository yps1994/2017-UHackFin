import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class StockTable extends React.Component {

  updateChildStockList = (stockList, row, cellValue) => {
    var index = stockList.findIndex(i => i.name === row.name);
    stockList[index]['lots'] = cellValue;

    return (stockList);
  }

  onAfterSaveCell = (row, cellName, cellValue) => {
    this.props.updateParentStockList(this.updateChildStockList(this.props.stockList, row, cellValue));
  }

  onAfterDeleteRow = (key) => {
    let stockList = this.props.stockList;
    for (let j = 0; j < key.length; ++j) {
      var index = stockList.findIndex(i => i.name === key[j]);

      // If the index cannot be found (which supposed it won't happen)
      if (index !== -1) {
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
        <TableHeaderColumn isKey dataField='code' dataSort> Stock Code</TableHeaderColumn>
        <TableHeaderColumn dataField='name' dataSort> Stock Name</TableHeaderColumn>
        <TableHeaderColumn dataField='tradingDay' dataSort> Trading Day </TableHeaderColumn>
        <TableHeaderColumn dataField='shares' dataSort> Deposits (Shares) </TableHeaderColumn>
        <TableHeaderColumn dataField='buyingPrice' dataSort editable={{validator: amountValidator}} dataFormat={this.moneyFormatter}> Buying Price</TableHeaderColumn>
        <TableHeaderColumn dataField='currentPrice' dataSort dataFormat={this.moneyFormatter}> Current Price </TableHeaderColumn>
        <TableHeaderColumn dataField='earn' dataSort dataFormat={this.amountFormatter}> Earn/Loss </TableHeaderColumn>
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