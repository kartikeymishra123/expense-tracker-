let jwt = require("jsonwebtoken");

function createTokenForUser(user) {
  let payload = {
    _id: user._id,
    email: user.email,
  };

  let token = jwt.sign(payload, process.env.secret);
  return token;
}

function validateToken(req, res, next) {
  // let payload = jwt.verify(token, secret);
  // return payload;

  let authheader = req.headers.authorization;
  if (!authheader || !authheader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  let token = authheader.split(" ")[1];

  try {
    let decoded = jwt.verify(token, process.env.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: `some error occured ${error}` });
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
