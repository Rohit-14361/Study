// token authentication valid hai ya ni
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

exports.isAuth = async (req, res, next) => {
  try {
    // fetch token
    const token =
      req.body.token ||
      req.cookie("token") ||
      req.headers["Authorization"].replace("Bearer ", "");
    if (!token || token.length == 0) {
      return res.status(401).json({
        success: true,
        message: "You are not logged in ! Please logged in first",
      });
    }
    try {
      // verify token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
    } catch (err) {
      // verification issue
      console.log(err);
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isStudent

exports.isStudent = async (req, res, next) => {
  try {
    const role = req.user.accountType;
    //     const user =await User.findOne({email})
    //     if(user.role !=="Student"){ return res.status(401).json({success:false,message:"You are not a student"})}
    if (role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This route is restrict for the Student",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified,please try again later",
    });
  }
};
// isInstructor
exports.isInstructor = async (req, res, next) => {
  const role = req.user.accountType;
  try {
    if (role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This route is restrict for the Student",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again later",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  const role = req.user.accountType;
  try {
    if (role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This route is restrict for the Admin",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again later",
    });
  }
};
