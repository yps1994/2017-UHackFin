const jwt = require('jwt-simple');
const msg = require('./error-message');


module.exports = (req, res, next) => {
  const token = req.query.token;
  if (token) {
    try {
      const decoded = jwt.decode(token, process.env.JWT_SECRET);
      req.iss = decoded.iss;
      return next();

    } catch (err) {
      res.json(401, msg.IncorrectTokenError);
      return next(false);
    }
  } else {
    res.json(401, msg.IncorrectTokenError);
    return next(false);
  }
};
