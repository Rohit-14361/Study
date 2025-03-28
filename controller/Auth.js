const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utils/jwt");
const mailSender = require("../utils/mailSender");
// send otp before signup

exports.sendOTP = async (req, res) => {
  try {
    // fetch email from req.body
    const { email } = req.body;
    //     check if user already exist
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered",
      });
    }
    //     generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated successfully", otp);

    //    check otp unique or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    //
    const otpPayload = { email, otp };
    // create an entry in db for otp
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// signup

exports.signUp = async (req, res) => {
  try {
    // data fetch from req.body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      acountType,
      contactNumber,
      otp,
    } = req.body;
    // validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // check  password and confirmPassword are same or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password value doesnot match",
      });
    }
    // check user already exist or not
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }
    // find most recent otp stored from user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    //     validate otp
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp not found ",
      });
    }
    // check otp match or not or validate otp
    else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    // create entry in db
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return response
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered . Please try again later",
    });
  }
};
// login

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // compare password
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // payload
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    //generate jwt token
    const token = await createToken(payload);
    user.token = token; // assign token to user
    user.password = undefined;
    //create cookie

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options).json({
      success: true,
      token,
      user,
      message: "Logged in successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Login Failed . Please try again later",
    });
  }
};

// changePassword
exports.changePassword = async (req, res) => {
  try {
    // fetch data from req.body
    const userDetails = await User.findById(req.user.id);
    // get old password,new password,confirm password
    const { oldPassword, newPassword, confirmPassword } = req.body;
    // check if old password is correct
    const verifyPassword = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!verifyPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }
    // validation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // encrypt the password
    const encryptPassword = await bcrypt.hash(newPassword);

    // find the user by id and update password
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: encryptPassword,
      },
      { new: true }
    );
    try {
      const sendingMail = await mailSender(
        updatedUser.email,
        "Password for your account has been updated",
        passwordUpdate(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (err) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // send mail -password update
  } catch (error) {
    // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while sending email",
      error: error.message,
    });
  }
};
