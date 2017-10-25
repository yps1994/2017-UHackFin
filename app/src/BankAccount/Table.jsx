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

  // Rendering section
  render = () => {
    // get data from state, not from props
    const listAccount = this.props.accountList;
    const cellEditProp = {
      mode: 'click',
      blurToSave: true,
      afterSaveCell: this.onAfterSaveCell
    };

    return (

        <BootstrapTable data={listAccount} cellEdit={cellEditProp} striped hover condensed>
          <TableHeaderColumn isKey dataField='name'>Account name</TableHeaderColumn>
          <TableHeaderColumn dataField='amount'>Amount</TableHeaderColumn>
        </BootstrapTable>
    );
  }
}
