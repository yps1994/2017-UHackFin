import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

import { isNumeric } from '../Utility/HelperFunction';

export default class BankAccountForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      inputAccountAmount: '',
      inputAccountName: ''
    };
  }

  createAccountObject = (name, amount) => {
    return { name: this.name, amount: this.amount };
  }

  clearAccountFormInput = () => {
    this.setState({
      inputAccountAmount: '',
      inputAccountName: ''
    });
  };

  // Note we should use this.setState instead directly accessing the elements.
  // See http://jamestw.logdown.com/posts/258005-reactjs-state
  addAccount = (e) => {

    e.preventDefault(); //Prevent auto-refresh the webpage after submitting the form.

    if (this.getAccountAmountValidation() !== 'success' || this.getAccountNameValidation() !== 'success') { return; }

    const accountList = this.props.accountList;

    accountList.push({
      name: this.state.inputAccountName,
      amount: Number(parseFloat(this.state.inputAccountAmount).toFixed(2))
    });

    this.props.updateParentAccountList(accountList);

    this.clearAccountFormInput();
  }

  // It is necessarily to create a function acting as middleman between the components and the textbox values.
  updateInputAccountName = (name) => {
    this.setState({
      inputAccountName: name.target.value
    });
  }

  updateInputAccountAmount = (amount) => {
    this.setState({
      inputAccountAmount: amount.target.value
    });
  }

  getAccountNameValidation = () => {
    const accountList = this.props.accountList;
    const inputAccountName = this.state.inputAccountName;

    if (accountList == null || inputAccountName === '') return null;

    if (inputAccountName.length > 30) return 'error';
    var index = accountList.findIndex(i => i.name === inputAccountName);

    if (index !== -1 || !inputAccountName) return 'error';
    else return 'success';
  }

  getAccountAmountValidation = () => {
    if (this.state.inputAccountAmount === '') return null;
    else if (isNumeric(this.state.inputAccountAmount)) return 'success';
    else return 'error';
  }

  // Rendering section
  render = () => {
    return (
      <div>
        <Form onSubmit={this.addAccount}>
          <FormGroup controlId="formAccountName" validationState={this.getAccountNameValidation()}>

            <ControlLabel>Bank account&#39;s name</ControlLabel>
            <FormControl
              type="text"
              className="bankaccount-name-textbox"
              placeholder="Enter account's name"
              value={this.state.inputAccountName}
              onChange={name => this.updateInputAccountName(name)}
            />
            <FormControl.Feedback/>
            <HelpBlock>Your account&#39;s name should be different from the above table. (Maximum 30 characters.) </HelpBlock>
          </FormGroup>

          <FormGroup controlId="formAccountAmount" validationState={this.getAccountAmountValidation()}>
            <ControlLabel>Amount</ControlLabel>
            <FormControl
              type="text"
              className="bankaccount-amount-textbox"
              placeholder="Amount"
              value={this.state.inputAccountAmount}
              onChange={amount => this.updateInputAccountAmount(amount)}
            />
            <FormControl.Feedback/>
            <HelpBlock>The amount should be greater than or equal to 0. </HelpBlock>
          </FormGroup>

          <Button className="addButton" type="submit" bsStyle="primary" >Add account</Button>
        </Form>

      </div>
    );
  }
}