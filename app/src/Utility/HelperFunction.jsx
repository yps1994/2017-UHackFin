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
    var result = [];
    data.forEach((data, i) => result.push({UnixTime: Date.parse(data['date']), Amount: data['amount']}));
    return result;
}

export const ReactTableAmountFormatter = (cell, row) => {
    var formattedVal = parseFloat(cell).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    return `$ ${formattedVal}`;
}

export const ReactTableAmountValidator = (amount) => {
  
    var parsedAmount = parseFloat(amount, 10);
    
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount < 0) {
      return "Amount must be greater than or equal to 0.";
    }

    return true;
}

/*export const ReactTableCSVFormatter = (cell, row) => {
    return `${row.id}: ${cell}`;
  }
*/