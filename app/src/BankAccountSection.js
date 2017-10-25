import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import {Doughnut} from 'react-chartjs-2'

// TODO:    1) Include Bootstrap CSS
//          2) Change the whole thing to table
//          3) Add delete button so that the list can be removed at any time

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression


export default class BankAccountSection extends React.Component {
  constructor(props) {
    super(props);
    //this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    // save data in state
    this.state = {
      size: 0,
      inputAccountName: '',
      inputAccountAmount: '',
      listAccount: [],
    };
  }

  editAccountAmount = (row, amount) => {
    this.listAccount[row].amount.setState({ amount });
  }

  createAccountObject = (name, amount) => {
    return { name: this.name, amount: this.amount };
  }

  // Note we should use this.setState instead directly accessing the elements.
  // See http://jamestw.logdown.com/posts/258005-reactjs-state
  addAccount = () => {

    if (!isValidate(this.state.inputAccountName, this.state.inputAccountAmount))
      return;

    const listAccount = this.state.listAccount;

    this.state.listAccount.push({
      name: this.state.inputAccountName,
      amount: this.state.inputAccountAmount
    });

    this.setState({ size: this.state.size + 1 });
    this.setState({ listAccount });
  }

  // It is necessarily to create a function acting as middleman between the components and the textbox values.
  updateBankName = (name) => {
    this.setState({
      inputAccountName: name.target.value
    });
  }

  updateBankAmount = (amount) => {
    this.setState({
      inputAccountAmount: amount.target.value
    });
  }

  updateBankAccountList = (updatedListAccount) => {
    this.setState({listAccount: updatedListAccount});
  }

  // Rendering section
  render = () => {
    // get data from state, not from props
    const listAccount = this.state.listAccount;

    return (
      <div>
        <div class="col-md-6 divider-right-1px">
          <BankAccountTable AccountList={listAccount} updateParentAccountList={this.updateBankAccountList} />

          <Form>
            <FormGroup controlId="formBasicText">

              <ControlLabel>Bank account&#39;s name</ControlLabel>
              <FormControl
                type="text"
                className="bankaccount-name-textbox"
                placeholder="Enter account's name"
                value={this.state.inputAccountName}
                onChange={name => this.updateBankName(name)}
              />

              <ControlLabel>Amount</ControlLabel>
              <FormControl
                type="text"
                className="bankaccount-amount-textbox"
                placeholder="Amount"
                value={this.state.inputAccountAmount}
                onChange={amount => this.updateBankAmount(amount)}
              />

            </FormGroup>
          </Form>

          <button className="addButton" onClick={this.addAccount}>Add account</button>
        </div>

        <div class="col-md-6 divider-left-1px">
          <BankAccountPieChart AccountList={listAccount} />
        </div>
      </div>
    );
  }
}

class BankAccountTable extends React.Component {
  constructor(props) {
    super(props);
  };

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

const options = {
  title: {
    display: true,
    fontSize: 18,
    text: 'Composition of your portfolio'
  }
}

class BankAccountPieChart extends React.Component {

  render = () => {

    const chartData = convertListAccountData(this.props.AccountList);

    if (chartData.labels.length > 0) {
      return (
        <Doughnut data={chartData} options={options} />
      );
    }
    else {
      return (
        <div> Please enter data.</div>
      );
    }
  }
}

function isValidate(name, amount) {

  if (isNaN(amount) || !isFinite(amount) || amount < 0) {
    return false;
  }

  return true;
}

//Peter Yeung: The conversion is terribly troublesome. You have to deal with syntax of array and list respectively.
//https://github.com/jerairrest/react-chartjs-2
function convertListAccountData(listAccount) {

  var i;
  var chartObject = {};
      chartObject.labels = [];
      chartObject.datasets = [];
  var tempData = {};
      tempData.data = [];
      tempData.backgroundColor = [];

  for (i = 0; i < listAccount.length; ++i) {
    chartObject.labels.push(listAccount[i]['name']);
    tempData.data.push(listAccount[i]['amount']);
    tempData.backgroundColor.push(getColor(i * 3 % 17));
  }

  chartObject.datasets.push(tempData);

  return chartObject;
}

//Predefined color because chartJS does not provide any color scheme.........
function getColor(index) {
  var color = ['#00BAF2', '#00BAF2', '#00a7d9', /* light blue */
  '#E80C60', '#E80C60', '#d00a56', /* light pink */
  '#9B26AF', '#9B26AF', '#8b229d', /* light purple */
  '#E2D51A', '#E2D51A', '#E2D51A', /* med yellow */
  '#FB301E', '#FB301E', '#e12b1b', /* med red */
  '#00AE4D', '#00AE4D', '#00AE4D']; /* med green */

  return color[index];
}