import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap';
import axios from 'axios';

import '../../node_modules/react-datepicker/dist/datepicker.css';


export default class StockForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      inputStockCode: '',
      inputStockShares: '',
      inputStockTradingDay: moment(),
      inputStockBuyingPrice: '',
    };
  }

  clearStockFormInput = () => {
    this.setState({
      inputStockCode: '',
      inputStockShares: '',
      inputStockTradingDay: moment(),
      inputStockBuyingPrice: ''
    });
  };

  // Note we should use this.setState instead directly accessing the elements.
  // See http://jamestw.logdown.com/posts/258005-reactjs-state
  addStock = (e) => {

    e.preventDefault(); //Prevent auto-refresh the webpage after submitting the form.

    if (this.getStockSharesValidation() !== 'success') { return; }

    axios.get("http://143.89.19.10:3000/stocks/raw_d/" + this.state.inputStockCode + "/?d1=" + (this.state.inputStockTradingDay).add(2, 'days').format('YYYY-MM-DD'))
    .then((response) => {
      const stockList = this.props.stockList;
      const ret = response.data.data[0];
      var buyingPrice = this.state.inputStockBuyingPrice;
      
      if (isNaN(buyingPrice) || !isFinite(buyingPrice) || buyingPrice === '') {
        buyingPrice = (parseFloat(ret.low) + parseFloat(ret.high)) / 2;
      }

      stockList.push({
        id: stockList.length + 1,
        code: ret.STOCKCODE,
        name: ret.NAME_ENG,
        tradingDay: String(ret.date).slice(0, String(ret.date).indexOf("T")),
        shares: Number(this.state.inputStockShares),
        buyingPrice: Number(buyingPrice),
        currentPrice: Number(ret.close),
        earn: (this.state.inputStockShares * (ret.close - this.state.inputStockBuyingPrice)).toFixed(2),
        amount: (Number(ret.close) * Number(this.state.inputStockShares)).toFixed(2)
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
      inputStockTradingDay: tradingDay
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
            <DatePicker
              dateFormat="YYYY-MM-DD"
              className="stock-trading-day-textbox"
              placeholder="Trading Day"
              selected={this.state.inputStockTradingDay}
              onChange={amount => this.updateInputStockTradingDay(amount)}
            />
            <FormControl.Feedback/>
            <HelpBlock>The trading day of the stock must be in YYYY-MM-DD format. </HelpBlock>
          </FormGroup>

          <FormGroup controlId="formStockBuyingPrice">
            <ControlLabel>Buying Price (Optional)</ControlLabel>
            <FormControl
              type="text"
              className="stock-buying-price-textbox"
              placeholder="Buying Price (Optional)"
              value={this.state.inputStockBuyingPrice}
              onChange={price => this.updateInputStockBuyingPrice(price)}
            />
            <FormControl.Feedback/>
            <HelpBlock>The buying price of the stock. If empty, the average between the min and max price during the transaction day will be used.</HelpBlock>
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
