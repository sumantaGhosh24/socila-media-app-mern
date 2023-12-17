const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({message: "Unauthorized"});
    }
    const token = authHeader?.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({message: "Forbidden"});
      const user = await User.findOne({_id: decoded?.UserInfo?.id});
      req.user = user;
      req.email = decoded?.UserInfo?.email;
      req.role = decoded?.UserInfo?.role;
      req.id = decoded?.UserInfo?.id;
      next();
    });
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};

module.exports = auth;
