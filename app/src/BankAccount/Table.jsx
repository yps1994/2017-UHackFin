import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class BankAccountTable extends React.Component {

  updateChildAccountList = (accountList, row, cellValue) => {
    var index = accountList.findIndex(i => i.name === row.name);
    accountList[index]['amount'] = cellValue;

    return(accountList);
  }


  // Rendering section
  render = () => {
    // get data from state, not from props
    const listAccount = this.props.accountList;
    const cellEditProp = {
      mode: 'click',
      blurToSave: true,
    };

    return (

        <BootstrapTable data={listAccount} cellEdit={cellEditProp} striped={true} hover={true} condensed={true}>
          <TableHeaderColumn isKey dataField='name'>Account name</TableHeaderColumn>
          <TableHeaderColumn dataField='amount'>Amount</TableHeaderColumn>
        </BootstrapTable>
    );
  }
}
