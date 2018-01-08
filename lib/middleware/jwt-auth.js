const jwt = require('jsonwebtoken');

function extract_access_token = (req) {
  let access_token, fields;
  const authHeader = req.headers[ 'authorization' ]
  if authHeader?
    fields = authHeader.split ' '
    if (fields.length == 2) && (fields[ 0 ] == 'Bearer')
      access_token = fields[ 1 ]
  let jwtCookie = req.cookies ? req.cookies.jwt : undefined;
  let jwtQueryString = req.query ? req.query.jwt : undefined;
  let jwtBody = req.body ? req.body.jwt : undefined;
  return access_token || jwtCookie || jwtQueryString || jwtBody;
}

function validateToken = (secret) {
  return (req, res, next) {
    const token = extract_access_token(req)
    return jwt.verify token, secret, (err, decoded) {
      if (err) {
        next(err);
      }else{
        req.validatedToken = decoded;
        next();
      }
    }
  }
}

module.exports =
  validateToken: validateToken