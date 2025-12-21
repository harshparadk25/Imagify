
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const rawHeader = req.header("Authorization") || req.header("authorization");
    const token = rawHeader?.replace?.(/^Bearer\s+/i, "") || null;

    

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

   
    req.user = {
      id: decoded.id || decoded._id || decoded.userId || null,
      role: decoded.role || null,
      raw: decoded
    };

    if (!req.user.id) {
      console.warn('[Auth] token decoded but no id found (decoded keys:)', Object.keys(decoded));
      return res.status(401).json({ message: "Invalid token payload: missing user id." });
    }

    next();
  } catch (error) {
    console.error("[Auth] Error verifying token:", error && error.message);
    return res.status(401).json({ message: "Invalid token." });
  }
};
