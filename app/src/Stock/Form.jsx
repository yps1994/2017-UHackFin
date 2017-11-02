import React from 'react';
import {Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap';

export default class StockForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      inputStockID: '',
      inputStockLots: '',
      inputStockBuyDate: '',
      newStockData: []
    };
  }

  async fetchStockData(inputStockID, buyDate) {

    const response = await fetch("http://143.89.19.10:3000/stocks/raw_d/" + inputStockID + "/?d1=" + buyDate);
    this.state.newStockData = response.json;

  }

  clearStockFormInput = () => {
    this.setState({
      inputStockID: '',
      inputStockLots: '',
      inputStockBuyDate: ''
    });
  };

  // Note we should use this.setState instead directly accessing the elements.
  // See http://jamestw.logdown.com/posts/258005-reactjs-state
  addStock = (e) => {

    e.preventDefault(); //Prevent auto-refresh the webpage after submitting the form.

    if (this.getStockLotsValidation() !== 'success') { return; }

    this.fetchStockData(this.state.inputStockID, this.state.inputStockBuyDate);

    const stockList = this.props.stockList;

    stockList.push({
      name: this.state.inputStockLots,
      amount: parseFloat(this.state.inputStockID).toFixed(2)
    });

    this.props.updateParentStockList(stockList);

    this.clearStockFormInput();
    this.newStockData = [];
  }

  // It is necessarily to create a function acting as middleman between the components and the textbox values.
  updateInputStockID = (id) => {
    this.setState({
      inputStockID: id.target.value
    });
  }

  updateInputStockLots = (lots) => {
    this.setState({
      inputStockLots: lots.target.value
    });
  }


  getStockLotsValidation = () => {
    if (this.state.inputStockLots === '') return null;
    else if (isNumeric(this.state.inputStockLots)) return 'success';
    else return 'error';
  }

  // Rendering section
  render = () => {
    return (
      <div>
        <Form onSubmit={this.addStock}>
          <FormGroup controlId="formStockID">

            <ControlLabel>Stock&#39;s ID</ControlLabel>
            <FormControl
              type="text"
              className="stock-name-textbox"
              placeholder="Enter Stock ID"
              value={this.state.inputStockID}
              onChange={name => this.updateInputStockID(name)}
            />
            <FormControl.Feedback/>
            <HelpBlock>Your stock ID must exist in our database. </HelpBlock>
          </FormGroup>

          <FormGroup controlId="formStocklots" validationState={this.getStockLotsValidation()}>
            <ControlLabel>Lots</ControlLabel>
            <FormControl
              type="text"
              className="stock-lots-textbox"
              placeholder="Lots"
              value={this.state.inputAccountAmount}
              onChange={amount => this.updateInputStockLots(amount)}
            />
            <FormControl.Feedback/>
            <HelpBlock>The amount should be greater than or equal to 0. </HelpBlock>
          </FormGroup>

          <Button className="addButton" type="submit" bsStyle="primary" >Add stock</Button>
        </Form>

      </div>
    );
  }
}

function isNumeric (amount) {
  var parsedAmount = parseFloat(amount, 10);
  if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount < 0) return false;

  return true;
}
