const validator = require('validator');

const isValidDate = x => {
  return validator.isISO8601(x) && x.length===10;
};

module.exports = {
  isValidDate: isValidDate
};
