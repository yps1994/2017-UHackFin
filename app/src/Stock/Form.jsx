import React from 'react';
import {Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap';
import axios from 'axios';

export default class StockForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      inputStockCode: '',
      inputStockShares: '',
      inputStockTradingDay: '',
      inputStockBuyingPrice: '',
    };
  }

  clearStockFormInput = () => {
    this.setState({
      inputStockCode: '',
      inputStockShares: '',
      inputStockTradingDay: '',
      inputStockBuyingPrice: ''
    });
  };

  // Note we should use this.setState instead directly accessing the elements.
  // See http://jamestw.logdown.com/posts/258005-reactjs-state
  addStock = (e) => {

    e.preventDefault(); //Prevent auto-refresh the webpage after submitting the form.

    if (this.getStockSharesValidation() !== 'success') { return; }

    axios.get("http://143.89.19.10:3000/stocks/raw_d/" + this.state.inputStockCode + "/?d1=" + this.state.inputStockTradingDay)
    .then((response) => {
      const stockList = this.props.stockList;
      const ret = response.data.data[0];

      stockList.push({
        code: ret.STOCKCODE,
        name: ret.NAME_ENG,
        tradingDay: ret.date,
        shares: this.state.inputStockShares,
        buyingPrice: Number(this.state.inputStockBuyingPrice),
        currentPrice: Number(ret.close),
        earn: (this.state.inputStockShares * (ret.close - this.state.inputStockBuyingPrice)).toFixed(2)
      });

      this.props.updateParentStockList(stockList);

      this.clearStockFormInput();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // It is necessarily to create a function acting as middleman between the components and the textbox values.
  updateInputStockCode = (code) => {
    this.setState({
      inputStockCode: code.target.value
    });
  }

  updateInputStockShares = (shares) => {
    this.setState({
      inputStockShares: shares.target.value
    });
  }

  updateInputStockBuyingPrice = (buyingPrice) => {
    this.setState({
      inputStockBuyingPrice: buyingPrice.target.value
    });
  }

  updateInputStockTradingDay = (tradingDay) => {
    this.setState({
      inputStockTradingDay: tradingDay.target.value
    });
  }


  getStockSharesValidation = () => {
    if (this.state.inputStockShares === '') return null;
    else if (isNumeric(this.state.inputStockShares)) return 'success';
    else return 'error';
  }

  // Rendering section
  render = () => {
    return (
      <div>
        <Form onSubmit={this.addStock}>
          <FormGroup controlId="formStockCode">

            <ControlLabel>Stock Code</ControlLabel>
            <FormControl
              type="text"
              className="stock-code-textbox"
              placeholder="Enter Stock Code"
              value={this.state.inputStockCode}
              onChange={name => this.updateInputStockCode(name)}
            />
            <FormControl.Feedback/>
            <HelpBlock>Your stock code must exist in our database. </HelpBlock>
          </FormGroup>

          <FormGroup controlId="formStockShares" validationState={this.getStockSharesValidation()}>
            <ControlLabel>Shares</ControlLabel>
            <FormControl
              type="text"
              className="stock-shares-textbox"
              placeholder="Shares"
              value={this.state.inputStockShares}
              onChange={amount => this.updateInputStockShares(amount)}
            />
            <FormControl.Feedback/>
            <HelpBlock>The stock share should be greater than or equal to 0. </HelpBlock>
          </FormGroup>

          <FormGroup controlId="formStockTradingDay">
            <ControlLabel>Trading Day</ControlLabel>
            <FormControl
              type="text"
              className="stock-trading-day-textbox"
              placeholder="Trading Day"
              value={this.state.inputStockTradingDay}
              onChange={amount => this.updateInputStockTradingDay(amount)}
            />
            <FormControl.Feedback/>
            <HelpBlock>The trading day of the stock must be valid. </HelpBlock>
          </FormGroup>

          <FormGroup controlId="formStockBuyingPrice">
            <ControlLabel>Buying Price</ControlLabel>
            <FormControl
              type="text"
              className="stock-buying-price-textbox"
              placeholder="Buying Price"
              value={this.state.inputStockBuyingPrice}
              onChange={price => this.updateInputStockBuyingPrice(price)}
            />
            <FormControl.Feedback/>
            <HelpBlock>The buying price of the stock. </HelpBlock>
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
