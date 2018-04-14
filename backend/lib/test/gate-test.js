const should = require('should');
const gate = require('../gate');

describe('#average', () => {
  let x = '2018-02-20';
  it(x+' should be a valid date', done => {
    const ans = gate.isValidDate(x);
    ans.should.be.true;
    done();
  });

  x = '02-20-2018';
  it(x+' should not be a valid date', done => {
    const ans = gate.isValidDate(x);
    ans.should.be.false;
    done();
  });

  x = '20180220';
  it(x+' should not be a valid date', done => {
    const ans = gate.isValidDate(x);
    ans.should.be.false;
    done();
  });
});
