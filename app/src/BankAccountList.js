import React from 'react';
import {Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

// TODO:	1) Include Bootstrap CSS
//			2) Change the whole thing to table
//			3) Add delete button so that the list can be removed at any time

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

const cellEditProp = {
	mode: 'click'
};

class BankAccountList extends React.Component{
	constructor(props){
		super(props);

		// save data in state
		this.state = {
			size: 0,
			inputAccountName: '',
			inputAccountAmount: '',
			listAccount: [],
		};
	}

	createAccountObject = (name, amount) => {
		return {name: this.name, amount: this.amount};
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

		this.setState({size: this.state.size + 1});
		this.setState({listAccount});
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

	  
	// Rendering section
	render = () => {
		// get data from state, not from props
		const listAccount = this.state.listAccount;

		return (

			<div> 
				<BootstrapTable data={listAccount} cellEdit={cellEditProp} striped={true} hover={true} condensed={true}>
					<TableHeaderColumn isKey dataField='name'>Account name</TableHeaderColumn>
					<TableHeaderColumn dataField='amount'>Amount</TableHeaderColumn>
				</BootstrapTable>

				<p> You have entered {this.state.listAccount.length} account. </p>
				<Form>
					<FormGroup
						controlId="formBasicText"
					>

					<ControlLabel>Bank account's name</ControlLabel>
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
		);
	}
}

function isValidate(name, amount) {

	if (isNaN(amount) || !isFinite(amount) || amount < 0) {
		return false;
	}
	
	return true;
}

export default BankAccountList;