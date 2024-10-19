const router = require("express").Router();

const commentCtrl = require("../controllers/commentCtrl");
const auth = require("../middleware/auth");

router.post("/comment", auth, commentCtrl.createComment);

router.delete("/comment/:id", auth, commentCtrl.deleteComment);

module.exports = router;
