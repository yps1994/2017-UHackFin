const validator = require('validator');

const isValidDate = x => {
  return validator.isISO8601(x) && x.length === 10;
};

const isValidEmail = x => {
  return validator.isEmail(x);
};

//TODO: It should be hashed and salted.
const isCorrectPasswd = (guess, encrypted) => {
  return guess === encrypted;
};

module.exports = {
  isValidDate: isValidDate,
  isValidEmail: isValidEmail,
  isCorrectPasswd: isCorrectPasswd
};
