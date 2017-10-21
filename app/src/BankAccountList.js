import React, { Component } from 'react';

// TODO:	1) Include Bootstrap CSS
//			2) Change the whole thing to table
//			3) Add delete button so that the list can be removed at any time

// Peter Yeung: ReactJS used huge amount of syntax similar with lambda expression

class BankAccountList extends React.Component{
	constructor(props){
		super(props);

		// save data in state
		this.state = {
			size: 0,
			inputAccountName: '',
			inputAccountAmount: 0,
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
		const currSize = this.state.size;

		return (
			<div> 
				<ul> {listAccount.map((currElement, index) => <li key={index}>{(currElement.name).concat(',').concat(currElement.amount)}</li> )} </ul>

				<p> You have entered {this.state.listAccount.length} account. </p>

				<br/> Bank account's name &nbsp;
				<input type="text" className="bankaccount-name-textbox" value={this.state.inputAccountName} onChange={name => this.updateBankName(name)}/>
				&nbsp; Amount &nbsp;
				<input type="text" className="bankaccount-amount-textbox" value={this.state.inputAccountAmount} onChange={amount => this.updateBankAmount(amount)}/> &nbsp;
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