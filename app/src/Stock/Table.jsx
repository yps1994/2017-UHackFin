import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { ReactTableAmountFormatter, ReactTableAmountValidator } from '../Utility/HelperFunction';

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
        stockList.splice(index, 1);
      }
    }

    
    this.props.updateParentStockList(stockList);
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
        <TableHeaderColumn isKey={true} dataField='id' width='50' dataSort> ID </TableHeaderColumn>
        <TableHeaderColumn dataField='code' width='120' dataSort editable={false}> Stock Code</TableHeaderColumn>
        <TableHeaderColumn dataField='name' width='160' dataSort editable={false}> Stock Name</TableHeaderColumn>
        <TableHeaderColumn dataField='tradingDay' width='120' dataSort editable={false}> Trading Day </TableHeaderColumn>
        <TableHeaderColumn dataField='shares' width='100' dataSort> Shares </TableHeaderColumn>
        <TableHeaderColumn dataField='buyingPrice' width='130' dataSort editable={{validator: ReactTableAmountValidator}} dataFormat={ReactTableAmountFormatter}> Buying Price</TableHeaderColumn>
        <TableHeaderColumn dataField='currentPrice' width='130' dataSort dataFormat={ReactTableAmountFormatter}> Current Price </TableHeaderColumn>
        <TableHeaderColumn dataField='earn' width='140'dataSort dataFormat={ReactTableAmountFormatter} editable={false}> Changes </TableHeaderColumn>
      </BootstrapTable>
      
    );
  }
}