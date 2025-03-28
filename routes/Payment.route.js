const express = require("express");
const router = express.Router();

// ***********************************************************************************************************
//                                 Import Controller & Middleware
// ***********************************************************************************************************

const { capturePayment, verifySignature } = require("../controller/Payments");

const {
  isAuth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middleware/auth.middleware");
// ***********************************************************************************************************
//                                                Import Routes
// ***********************************************************************************************************

router.post("/capturePayment", isAuth, isStudent, capturePayment);
router.post("/verifySignature", isAuth, verifySignature);
module.exports = router;
