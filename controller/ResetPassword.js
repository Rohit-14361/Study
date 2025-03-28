const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
// resetPasswordToken--mail send

exports.resetPasswordToken = async (req, res) => {
  try {
    // fetch email from req.body
    const { email } = req.body;
    // check user for this email if user exist then send mail with token

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your Email is  not registered with us",
      });
    }
    // genearate token
    const token = crypto.randomBytes(20).toString("hex");
    // update user ny adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 3600000, // 5 minutes
      },
      {
        new: true,
      }
    );
    console.log("updated Details");
    // create url

    //   link for frontend
    const url = `http://localhost:5173/update-password/${token}`;
    // send mail containing url
    await mailSender(
      email,
      "Password Reset Link",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );
    // return res
    return res.status(200).json({
      success: true,
      message: "Email send successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password mail",
    });
  }
};

// resetPassword---exact password db mein update krna hai woh yeah krega

exports.resetPassword = async (req, res) => {
  try {
    // token password cofirm password
    const { token, password, confirmPassword } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // get user details from db using token
    const userDetails = await User.findOne({ token: token });

    // if no entry -- invalid token
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    // check token expire time
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Token is expired , please regenarate your token",
      });
    }
    // hashpassword
    const hashPassword = await bcrypt.hash(password, 10);
    // password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashPassword },
      { new: true }
    );
    // return res
    return res.status(200).json({
      success: true,
      message: "Password Reset successfully",
    });
  } catch (err) {
    console.log(err);
  }
};
