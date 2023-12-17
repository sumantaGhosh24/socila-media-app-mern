const router = require("express").Router();

const authCtrl = require("../controllers/authCtrl");
const auth = require("../middleware/auth");

router.post("/register", authCtrl.register);

router.get("/register-verify", authCtrl.registerVerify);

router.post("/login", authCtrl.login);

router.post("/login-verify", authCtrl.loginVerify);

router.get("/logout", authCtrl.logout);

router.get("/refresh_token", authCtrl.generateAccessToken);

router.post("/reset-password", auth, authCtrl.resetPassword);

router.post("/forgot-password", authCtrl.forgotPassword);

router.get(
  "/validate-confirm-forgot-password",
  authCtrl.validateConfirmForgotPassword
);

router.post("/confirm-forgot-password", authCtrl.confirmForgotPassword);

module.exports = router;
