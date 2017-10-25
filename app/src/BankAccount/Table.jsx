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
      afterDeleteRow: this.onAfterDeleteRow
    }

    return (

        <BootstrapTable data={listAccount} cellEdit={cellEditProp} deleteRow={true} selectRow={selectRowProp} options={options} striped hover condensed>
          <TableHeaderColumn isKey dataField='name'>Account name</TableHeaderColumn>
          <TableHeaderColumn dataField='amount'>Amount</TableHeaderColumn>
        </BootstrapTable>
    );
  }
}
