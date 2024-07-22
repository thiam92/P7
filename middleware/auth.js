/* eslint-disable linebreak-style */
/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-destructuring */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable object-shorthand */
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
