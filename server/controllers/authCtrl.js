const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/userModel");

const authCtrl = {
  register: async (req, res) => {
    try {
      const {fullname, username, email, password, cf_password, gender} =
        req.body;
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
      if (password !== cf_password) {
        return res
          .status(400)
          .json({message: "Password and confirm password not matched."});
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
      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
      );
      const to = newUser.email;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      await transporter.sendMail({
        from: "Social-Media-Clone-MERN || Register Verification",
        to: to,
        subject: "Email Verification Link - Social-Media-Clone-MERN",
        html: `<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<style>
	*{margin:0;padding:0;box-sizing:border-box;}
	.container, .container-fluid{width:100%;padding-left:24px;padding-right:24px;margin-right:auto;margin-left:auto}
	.container{max-width:900px;}
	.bg-primary{background-color:#0d6efd;}
	.text-center{text-align:center;}
	.text-white{color:white;}
	.p-5{padding:48px;}
	.my-5{margin-top:48px;margin-bottom:48px;}
	.fw-bold{font-weight:700;}
	.text-muted{color:#6c757d;}
	.mb-5{margin-bottom:48px;}
	.position-relative{position:relative;}
	.position-absolute{position:absolute;}
	.top-50{top:50%;}
	.start-50{left:50%;}
	.p-3{padding:16px;}
	.btn{display:inline-block;font-weight:400;font-height:1.5;color:#212529;text-align:center;text-decoration:none;vertical-align:middle;cursor:pointer;user-select:none;background-color:transparent;border:1px solid transparent;padding:.375rem .75rem;font-size:16px;border-radius:.25rem;transition:all .7s ease-in-out;}
	.btn-primary{color:#fff;background-color:#0d6efd;border-color:#0a58ca;}
	.btn-primary:hover{color:#fff;background-color:#0b5ed7;border-color:#0a58ca;}
	h1{font-size:calc(1.375rem+1.5vw);}
	h2{font-size:calc(1.325rem+.9vw);}
	p{margin-top:0;margin-bottom:1rem;}
</style>
<title>Social-Media-Clone-MERN || Register Verification</title>
</head>
<body>
<div class="container-fluid bg-primary text-center"><h1 class="text-white p-5">Social-Media-Clone-MERN || Register Verification</h1></div>
<div class="container my-5"><h2 class="fw-bold">Hello,</h2><p class="text-muted">Click below button to activate your account.</p></div>
<div class="container my-5"><p class="text-muted">If you not ask for verify your account, you can ignore this email.</p><h2 class="fw-bold">Thanks for Register our website.</h2></div>
<div class="container mb-5"><div class="position-relative"><a class="position-absolute top-50 start-50 p-3 btn btn-primary" href="${process.env.FRONTEND_URL}/register-verify?token=${token}">Activate Account</a></div></div>
</body>
</html>`,
      });
      return res.json({
        message:
          "A verification email has been send, click the email link to activate you account.",
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  registerVerify: async (req, res) => {
    try {
      const token = req.query.token;
      if (!token) {
        return res.status(400).json({
          message: "Something wrong with your link, click your link again.",
        });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err)
          return res.status(400).json({
            message: "Something wrong with your link, click your link again.",
          });
        const us = await User.findById(user.id);
        if (!us)
          return res.status(400).json({
            message: "Something wrong with your link, click your link again.",
          });
        await User.findByIdAndUpdate(us._id, {status: "active"});
        const accessToken = jwt.sign(
          {
            UserInfo: {email: us.email, role: us.role, id: us._id},
          },
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: "15m"}
        );
        const refreshToken = jwt.sign(
          {id: us._id},
          process.env.REFRESH_TOKEN_SECRET,
          {expiresIn: "7d"}
        );
        res.cookie("refreshtoken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
          user: {accessToken},
          message: "Register successful!",
        });
      });
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
      if (user.status === "inactive")
        return res.status(400).json({
          message:
            "This email not verified, when you register a verification email send to your email, click email link to verify your email.",
        });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({message: "Invalid login credentials."});
      }
      const randomNumber = Math.floor(100000 + Math.random() * 999999);
      const check = jwt.sign(
        {num: randomNumber, id: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "20m"}
      );
      res.cookie("check", check, {
        httpsOnly: true,
        secured: true,
        maxAge: 10 * 60 * 1000,
      });
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      await transporter.sendMail({
        from: "Social-Media-Clone-MERN || Register Verification",
        to: user.email,
        subject: "Email Verification Link - Social-Media-Clone-MERN",
        html: `<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<style>
	*{margin:0;padding:0;box-sizing:border-box;}
	.container, .container-fluid{width:100%;padding-left:24px;padding-right:24px;margin-right:auto;margin-left:auto}
	.container{max-width:900px;}
	.bg-primary{background-color:#0d6efd;}
	.text-center{text-align:center;}
	.text-white{color:white;}
	.p-5{padding:48px;}
	.my-5{margin-top:48px;margin-bottom:48px;}
	.fw-bold{font-weight:700;}
	.text-muted{color:#6c757d;}
	.mb-5{margin-bottom:48px;}
	.position-relative{position:relative;}
	.position-absolute{position:absolute;}
	.top-50{top:50%;}
	.start-50{left:50%;}
	.p-3{padding:16px;}
	.btn{display:inline-block;font-weight:400;font-height:1.5;color:#212529;text-align:center;text-decoration:none;vertical-align:middle;cursor:pointer;user-select:none;background-color:transparent;border:1px solid transparent;padding:.375rem .75rem;font-size:16px;border-radius:.25rem;transition:all .7s ease-in-out;}
	.btn-primary{color:#fff;background-color:#0d6efd;border-color:#0a58ca;}
	.btn-primary:hover{color:#fff;background-color:#0b5ed7;border-color:#0a58ca;}
	h1{font-size:calc(1.375rem+1.5vw);}
	h2{font-size:calc(1.325rem+.9vw);}
	p{margin-top:0;margin-bottom:1rem;}
</style>
<title>Social-Media-Clone-MERN || Login Two Step Verification</title>
</head>
<body>
<div class="container-fluid bg-primary text-center"><h1 class="text-white p-5">Social-Media-Clone-MERN || Login Two Step Verification</h1></div>
<div class="container my-5"><h2 class="fw-bold">Hello,</h2><p class="text-muted">The bottom number is your otp, enter the number to complete your login process.</p></div>
<div class="container my-5"><p class="text-muted">If you not ask for login in your account, you can ignore this email.</p><h2 class="fw-bold">Thanks for Register our website.</h2></div>
<div class="container mb-5"><div class="position-relative"><code style="color: white; background: gray; padding: 10px 16px; font-weight: bold; font-size: 24px;">${randomNumber}</code></div></div>
</body>
</html>`,
      });
      return res.json({
        message: "A otp send to your email, enter the otp to login",
        verify: true,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  loginVerify: async (req, res) => {
    try {
      const check = req.cookies.check;
      if (!check) {
        return res
          .status(400)
          .json({message: "First login to access this page."});
      }
      jwt.verify(check, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
          res.clearCookie("check");
          return res.status(400).json({message: err.message});
        }
        const us = await User.findOne({_id: user.id});
        if (user.num == req.body.otp) {
          res.clearCookie("check");
          const accessToken = jwt.sign(
            {
              UserInfo: {email: us.email, role: us.role, id: us._id},
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
          );
          const refreshToken = jwt.sign(
            {id: us._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "7d"}
          );
          res.cookie("refreshtoken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          return res.json({
            user: {accessToken},
            message: "Login successful!",
          });
        } else {
          return res
            .status(400)
            .json({message: "Invalid otp, please check your email again."});
        }
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
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
          const user = await User.findOne({_id: decoded.id}).exec();
          if (!user) return res.status(401).json({message: "Unauthorized"});
          const accessToken = jwt.sign(
            {
              UserInfo: {email: user.email, role: user.role, id: user._id},
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
      res.clearCookie("refreshtoken", {httpOnly: true});
      return res.json({message: "Logged out!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  resetPassword: async (req, res) => {
    try {
      const {previousPassword, newPassword, cf_newPassword} = req.body;
      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({message: errors});
      }
      const user = await User.findById(req.user.id);
      const isMatch = await bcrypt.compare(previousPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({message: "Invalid login credentials."});
      }
      if (newPassword != cf_newPassword) {
        return res
          .status(400)
          .json({message: "Password and Confirm Password not match."});
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateUser = await User.findByIdAndUpdate(req.user.id, {
        password: hashedPassword,
      });
      if (!updateUser) {
        return res.status(400).json({message: "User does not exists."});
      }
      return res.json({message: "Your password has been reset."});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const {email} = req.body;
      const user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({message: "Email does not exist."});
      }
      const check = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      await transporter.sendMail({
        from: "Social-Media-Clone-MERN || Register Verification",
        to: user.email,
        subject: "Email Verification Link - Social-Media-Clone-MERN",
        html: `<!doctype html>
<html lang=en>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<style>
	*{margin:0;padding:0;box-sizing:border-box;}
	.container, .container-fluid{width:100%;padding-left:24px;padding-right:24px;margin-right:auto;margin-left:auto}
	.container{max-width:900px;}
	.bg-primary{background-color:#0d6efd;}
	.text-center{text-align:center;}
	.text-white{color:white;}
	.p-5{padding:48px;}
	.my-5{margin-top:48px;margin-bottom:48px;}
	.fw-bold{font-weight:700;}
	.text-muted{color:#6c757d;}
	.mb-5{margin-bottom:48px;}
	.position-relative{position:relative;}
	.position-absolute{position:absolute;}
	.top-50{top:50%;}
	.start-50{left:50%;}
	.p-3{padding:16px;}
	.btn{display:inline-block;font-weight:400;font-height:1.5;color:#212529;text-align:center;text-decoration:none;vertical-align:middle;cursor:pointer;user-select:none;background-color:transparent;border:1px solid transparent;padding:.375rem .75rem;font-size:16px;border-radius:.25rem;transition:all .7s ease-in-out;}
	.btn-primary{color:#fff;background-color:#0d6efd;border-color:#0a58ca;}
	.btn-primary:hover{color:#fff;background-color:#0b5ed7;border-color:#0a58ca;}
	h1{font-size:calc(1.375rem+1.5vw);}
	h2{font-size:calc(1.325rem+.9vw);}
	p{margin-top:0;margin-bottom:1rem;}
</style>
<title>Social-Media-Clone-MERN || Forgot Password</title>
</head>
<body>
<div class="container-fluid bg-primary text-center"><h1 class="text-white p-5">Social-Media-Clone-MERN || Forgot Password</h1></div>
<div class="container my-5"><h2 class="fw-bold">Hello,</h2><p class="text-muted">Click below button to forgot your password.</p></div>
<div class="container my-5"><p class="text-muted">If you not ask for forgot password in your email, you can ignore this email.</p><h2 class="fw-bold">Thanks for Register our website.</h2></div>
<div class="container mb-5"><div class="position-relative"><a class="position-absolute top-50 start-50 p-3 btn btn-primary" href="${process.env.FRONTEND_URL}/confirm-forgot-password?token=${check}">Forgot Password</a></div></div>
</body>
</html>`,
      });
      return res.json({
        message:
          "A forgot password link send to your email, click the email link to forgot your password.",
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  validateConfirmForgotPassword: async (req, res) => {
    try {
      const token = req.query.token;
      if (!token) {
        return res
          .status(400)
          .json({message: "Click your email link to forgot your password."});
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
          return res.status(400).json({message: err.message});
        }
        res.cookie("token", token, {httpOnly: true, maxAge: 10 * 60 * 1000});
        return res.status(200).json({message: "Now set your new password."});
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  confirmForgotPassword: async (req, res) => {
    try {
      const {password, cf_password} = req.body;
      const token = req.cookies.token;
      if (!token) {
        return res.status(400).json({
          message:
            "Something wrong with your link, click your email link again.",
        });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
          res.clearCookie("token", {httpOnly: true});
          return res.status(400).json({message: err.message});
        }
        if (password !== cf_password) {
          return res
            .status(400)
            .json({message: "Password and Confirm Password not match."});
        }
        const passwordHash = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(user.id, {password: passwordHash});
        res.clearCookie("token", {httpOnly: true});
        return res
          .status(200)
          .json({message: "Your password has been updated, now login."});
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
};

module.exports = authCtrl;
