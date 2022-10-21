const express =require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");

router.post("/register", async (req, res) => {
  authCtrl.register(req, res);
});


router.post("/login", async (req, res) => {
  authCtrl.login(req, res);
});

module.exports=router;
