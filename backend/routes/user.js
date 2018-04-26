const jwt = require('jwt-simple');

const logger = require('../lib/logger');
const gate = require('../lib/gate');
const msg = require('../lib/error-message');


module.exports = server => {
  /** 
   * @api {post} /user/register UserRegister
   * @apiExample {curl} Example usage:
   *     curl -H "Content-Type: application/json" -X POST -d '{"email": "test@test.com", "passwd": "password"}' http://localhost/user/register
   * @apiVersion 0.0.1
   * @apiName UserRegister
   * @apiGroup User
   * @apiDescription Register user with email and password 
   * @apiParam {String} email Registration email
   * @apiParam {String} passwd Registration password
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 204 OK
   * @apiError 400 Bad Request
   * @apiError 409 User Exists
   * @apiError (serverError) 503 Server error, which is usually related to unavailable database.
   */
  server.post('/user/register', (req, res, next) => {
    const connetor = req.con;
    const email = req.body.email || '';
    const passwd = req.body.passwd || '';
    if (!gate.isValidEmail(email) || !(passwd.length > 0)) {
      res.json(400, msg.BadRequstError);
      return next();
    }
    connetor.query('INSERT INTO user (email, passwd) VALUES (?, ?)', [email, passwd], err => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.json(409, msg.UserExistError);
        } else {
          logger.warn(err);
          res.json(503, msg.ServiceError);
        }
      } else {
        res.json(204);
      }
    });
    return next();
  });

  /** 
   * @api {post} /user/login UserLogin
   * @apiExample {curl} Example usage:
   *     curl -H "Content-Type: application/json" -X POST -d '{"email": "test@test.com", "passwd": "password"}' http://localhost/user/login
   * @apiVersion 0.0.1
   * @apiName UserLogin
   * @apiGroup User
   * @apiDescription Login with email and password 
   * @apiParam {String} email Registration email
   * @apiParam {String} passwd Registration password
   * @apiSuccess {Number} id Unique ID
   * @apiSuccess {String} token Permanent token
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *         "id": 23,
   *         "token": eyJ0eXAiOiJKV1QiLC
   *     }
   * @apiError 400 Bad Request
   * @apiError 401 Incorrect user email/password
   * @apiError (serverError) 503 Server error, which is usually related to unavailable database.
   */
  server.post('/user/login', (req, res, next) => {
    const connetor = req.con;
    const email = req.body.email || '';
    const passwd = req.body.passwd || '';
    if (!gate.isValidEmail(email) || !(passwd.length > 0)) {
      res.json(400, msg.BadRequstError);
      return next();
    }
    connetor.query('SELECT id, passwd FROM user WHERE email = ?', email, (err, data) => {
      if (err) {
        logger.warn(err);
        res.json(503, msg.ServiceError);
      } else if (data.length === 0) {
        res.json(401, msg.IncorrectInformationError);
      } else {
        const auth = data[0];
        if (!gate.isCorrectPasswd(passwd, auth.passwd)) {
          res.json(401, msg.IncorrectInformationError);
        } else {
          const token = jwt.encode({iss: email}, process.env.JWT_SECRET);
          res.json({'id': auth.id, 'token': token});
        }
      }
    });
    return next();
  });
};
