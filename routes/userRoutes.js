const userController = require("../controllers/userController.js");
const { sendSms } = require("../helpers/commonHelper.js");
const { authentication } = require("../middleware/authMiddleware.js");
const express = require("express");
const router = express.Router();

router.post("/register", userController.createUser);
router.post("/verifyOtp", authentication, userController.verifyOtp);
router.post("/userInfo", authentication, userController.userInfo);
router.post("/userPref", authentication, userController.userPref);
router.post("/login", userController.loginUser);
router.post("/interest", userController.interest);
router.post("/friend", authentication, userController.findFriends);
router.post("/createDate", authentication, userController.createDate);
router.delete("/deleteDate/:id", authentication, userController.deleteDate);
router.get("/findDate", authentication, userController.findDate);
router.put("/updateUser", authentication, userController.updateUserDetail);
router.post("/changePassword", authentication, userController.changePassword);
router.post("/addSubscription", authentication, userController.addSubscription);
router.post("/cms", authentication, userController.cms);
router.post("/likePost/:id", authentication, userController.likePost);

module.exports = router;
