const express = require("express");
const router = express.Router();

//************************************************************************************************************
//                                       Import Controller
//************************************************************************************************************

const { isAuth } = require("../middleware/auth.middleware");

const {
  deleteAccount,
  getAllUserDetails,
  updateProfile,
  updatedProfileDetails,
  getEnrolledCourses,
} = require("../controller/Profile");

// ***********************************************************************************************************
//                                       Import Routes
// ***********************************************************************************************************

router.delete("/deleteAccount", isAuth, deleteAccount);
router.get("/get-user-details", isAuth, getAllUserDetails);
router.put("/updateProfile", isAuth, updateProfile);

// update display picture  and  get Enrolled course
router.put("/update-profile-image", updatedProfileDetails);
router.get("/get-enrolled-courses", getEnrolledCourses);
module.exports = router;
