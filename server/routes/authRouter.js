const router = require("express").Router();

const authCtrl = require("../controllers/authCtrl");

router.post("/register", authCtrl.register);

router.post("/login", authCtrl.login);

router.get("/logout", authCtrl.logout);

router.get("/refresh_token", authCtrl.generateAccessToken);

module.exports = router;
