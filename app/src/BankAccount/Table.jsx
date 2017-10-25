import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class BankAccountTable extends React.Component {

  updateChildAccountList = (accountList, row, cellValue) => {
    var index = accountList.findIndex(i => i.name === row.name);
    accountList[index]['amount'] = cellValue;

    return(accountList);
  }

  onAfterSaveCell = (row, cellName, cellValue) => {
    this.props.updateParentAccountList(this.updateChildAccountList(this.props.accountList, row, cellValue));
  }


  // This is terribly confusing. The 'row' here is the key, which IS DIFFERENT from the one defined in updateChildAccountList.
  onAfterDeleteRow = (key) => {
    let accountList = this.props.accountList;
    for (let j = 0; j < key.length; ++j) {
      var index = accountList.findIndex(i => i.name === key[j]);

      // If the index cannot be found (which supposed it won't happen)
      if (index !== -1) {
        accountList.splice(index, 1)
      }

    }

    this.props.updateParentAccountList(accountList);
  }

  csvFormatter(cell, row) {
    return `${row.id}: ${cell}`;
  }

  amountFormatter(cell, row) {
    var formattedVal = parseFloat(cell).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    return `$ ${formattedVal}`;
  }
  // Rendering section
  render = () => {

    // Obtain account data from parent component
    const listAccount = this.props.accountList;

    // Options for cell edit
    const cellEditProp = {
      mode: 'click',
      blurToSave: true,
      afterSaveCell: this.onAfterSaveCell
    };

    // Options for mode on selecting rows
    const selectRowProp = {
      mode: 'checkbox'
    }

    // Hooking the operation of dropping rows
    const options = {

      page: 1,
      sizePerPageList: [ {
        text: '5', value: 5
      } ],
      sizePerPage: 5,  // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3,  // the pagination bar size.
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
      paginationPosition: 'top',  // default is bottom, top and both is all available

      afterDeleteRow: this.onAfterDeleteRow,
    }

    return (

        <BootstrapTable data={listAccount} cellEdit={cellEditProp} selectRow={selectRowProp} options={options}
          deleteRow exportCSV pagination striped hover condensed>
          <TableHeaderColumn isKey dataField='name' dataSort>Account name</TableHeaderColumn>
          <TableHeaderColumn dataField='amount' dataSort dataFormat={this.amountFormatter}>Amount</TableHeaderColumn>
        </BootstrapTable>
    );
  }
}
