const express = require("express");

const router = express.Router();

// ***********************************Import The Contorller and Middleware************************************

const {
  signUp,
  sendOTP,
  Login,
  changePassword,
} = require("../controller/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controller/ResetPassword");
// **************************************Routes for login singup and authentication****************************

// ***********************************************************************************************************
//                                                Authenticated route
// **********************************************************************************************************
router.post("/signup", signUp);
router.post("/sendotp", sendOTP);
router.post("/login", Login);
router.post("/changePassword", changePassword);

// **********************************************************************************************************
//                                           Reset Password
// **********************************************************************************************************

router.post("/reset-password-token", resetPasswordToken);

router.post("/reset-password", resetPassword);
module.exports = router;
