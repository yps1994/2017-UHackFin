import moment from 'moment';

export const isNumeric = (amount) => {

  var parsedAmount = parseFloat(amount, 10);
  if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount < 0) return false;

  return true;
}

export const moneyFormatter = (amount) => {
    return ("$" + parseFloat(amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
}

export const convertUnixTimeToDate = (unixTime) => {
    return (moment(unixTime)).format('YYYY-MM-DD');
}

export const convertToTimeSeriesList = (data) => {
    return (data.map(x => ({ UnixTime: Date.parse(x['date']), Amount: x['amount'] })));
}

export const ReactTableAmountFormatter = (cell, row) => {
    return moneyFormatter(cell);
}

export const ReactTableAmountValidator = (amount) => {

    if (!isNumeric(amount)) return "Amount must be greater than or equal to 0.";
    return true;
}