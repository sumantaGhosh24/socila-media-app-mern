const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const authCtrl = {
  register: async (req, res) => {
    try {
      const {fullname, username, email, password, gender} = req.body;
      let newUserName = username.toLowerCase().replace(/ /g, "");
      const user_name = await User.findOne({username: newUserName});
      if (user_name) {
        return res
          .status(400)
          .json({message: "This user name already exists."});
      }
      const user_email = await User.findOne({email});
      if (user_email) {
        return res.status(400).json({message: "This email already exists."});
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({message: "Password must be at least 6 characters."});
      }
      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = new User({
        fullname,
        username: newUserName,
        email,
        password: passwordHash,
        gender,
      });
      await newUser.save();
      return res.status(201).json({message: "User registration successful!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  login: async (req, res) => {
    try {
      const {email, password} = req.body;
      if (!email || !password) {
        return res.status(400).json({message: "All fields are required."});
      }
      const user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({message: "This email not registered."});
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({message: "Invalid login credentials."});
      }
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            role: foundUser.role,
            id: foundUser._id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
      );
      const refreshToken = jwt.sign(
        {email: foundUser.email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "7d"}
      );
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({accessToken});
    } catch (err) {
      return res.status(500).json({msg: err.message});
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.refreshtoken)
        return res.status(401).json({message: "Unauthorized"});
      const refreshToken = cookies.refreshtoken;
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.status(403).json({message: "Forbidden"});
          const foundUser = await User.findOne({email: decoded.email}).exec();
          if (!foundUser)
            return res.status(401).json({message: "Unauthorized"});
          const accessToken = jwt.sign(
            {
              UserInfo: {
                email: foundUser.email,
                role: foundUser.role,
                id: foundUser._id,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
          );
          return res.json({accessToken});
        }
      );
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  logout: async (req, res) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.refreshtoken) return res.sendStatus(204);
      res.clearCookie("refreshtoken", {path: "/api/refresh_token"});
      return res.json({message: "Logged out!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
};

module.exports = authCtrl;
