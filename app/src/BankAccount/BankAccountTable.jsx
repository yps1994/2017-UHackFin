import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class BankAccountTable extends React.Component {

  onBeforeSaveCell = (row, cellName, cellValue) => {
    return true;
  }


  onAfterSaveCell = (row, cellName, cellValue) => {
    this.props.updateParentAccountList(this.updateChildAccountList(this.props.AccountList, row, cellValue));
  }


  updateChildAccountList = (AccountList, row, cellValue) => {
    var index = AccountList.findIndex(i => i.name === row.name);
    AccountList[index]['amount'] = cellValue;

    return(AccountList);
  }


  // Rendering section
  render = () => {
    // get data from state, not from props
    const listAccount = this.props.AccountList;
    const cellEditProp = {
      mode: 'click',
      beforeSaveCell: this.onBeforeSaveCell,
      afterSaveCell: this.onAfterSaveCell
    };

    return (

        <BootstrapTable data={listAccount} cellEdit={cellEditProp} striped={true} hover={true} condensed={true}>
          <TableHeaderColumn isKey dataField='name'>Account name</TableHeaderColumn>
          <TableHeaderColumn dataField='amount'>Amount</TableHeaderColumn>
        </BootstrapTable>
    );
  }
}
