const jwt = require('jsonwebtoken');
const JWT_SECRET = "supersecret";

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Bad token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token invalid" });
  }
}
module.exports = authenticate;
