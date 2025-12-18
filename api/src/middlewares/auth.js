const { verifyToken } = require("../lib/auth");
const { User } = require("../models/user.model");

async function requireAuth(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const [, token] = hdr.split(" ");
    if (!token) return res.status(401).json({ ok: false, error: { code: "UNAUTHORIZED", message: "Missing token" } });
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ ok: false, error: { code: "UNAUTHORIZED", message: "User not found" } });
    req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email };
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, error: { code: "UNAUTHORIZED", message: "Login required" } });
    if (!roles.includes(req.user.role)) return res.status(403).json({ ok: false, error: { code: "FORBIDDEN", message: "Insufficient role" } });
    next();
  };
}

module.exports = { requireAuth, requireRole };