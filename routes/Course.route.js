const express = require("express");

const router = express.Router();

// *********************************************************************************************************
//                                   Import Controller & Middlewares
// *********************************************************************************************************

const {
  createCourse,
  editCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controller/Course");
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controller/Section");
const {
  createSubSection,
  updatedSubSection,
  deleteSubSection,
} = require("../controller/SubSection");

const {
  createCategory,
  getAllCategory,
  categoryPageDetails,
} = require("../controller/Category");

const {
  createRating,
  getAllRating,
  getAverageRating,
} = require("../controller/RatingAndReview");
const {
  isAuth,
  isInstructor,
  isAdmin,
  isStudent,
} = require("../middleware/auth.middleware");
// ***********************************************************************************************************
//                                     Import Routes
// ***********************************************************************************************************

// courses can be created only be Instrcutorss
router.post("/create-course", isAuth, isInstructor, createCourse);

// add section to the course
router.post("/add-section", isAuth, isInstructor, createSection);

// update section to the course
router.put("/update-section", isAuth, isInstructor, updateSection);

// delete section to the course
router.delete("/delete-section", isAuth, isInstructor, deleteSection);

// ********************************subsection handler***************

// add subsection to the section

router.post("/add-sub-section", isAuth, isInstructor, createSubSection);
// update subsection
router.put("/update-sub-section", isAuth, isInstructor, updatedSubSection);
// delete subsection
router.delete("/delete-sub-section", isAuth, isInstructor, deleteSubSection);

// update course
router.put("/update-course", isAuth, isInstructor, editCourse);

// *************************Course Details*****************************

// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin

// create category
router.post("/create-category", isAuth, isAdmin, createCategory);

// get all category
router.get("/get-all-category", getAllCategory);

// get category page details
router.get("/category-page-details", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

router.post("/create-rating", isAuth, isStudent, createRating);
router.get("/get-all-rating", getAllRating);
router.get("/get-reviews", getAverageRating);

module.exports = router;
