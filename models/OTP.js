const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/emailVerification");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  //otp value
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60, // 5 minutes
  },
});

// function -to send mail

const sendVerificationEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from RohitNotion",
      otpTemplate(otp)
    );
    console.log("Email sent successfully", mailResponse);
  } catch (err) {
    console.log("Error occur while sending mail", err);
  }
};

// for generating otp before saving into schema using nodemailer
OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp); // this refers to the document
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
