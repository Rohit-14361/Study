const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");

// createRating

exports.createRating = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;
    // fetch data from req.body
    const { courseId, rating, review } = req.body;
    // check if user is enrolled or not

    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $eleMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }
    // check user already rating review the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }
    // create rating and review
    const ratingAndReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    // update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: { ratingAndReviews: ratingAndReview._id },
      },
      { new: true }
    ).populate("ratingAndReviews");
    // return res
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      ratingAndReview,
      updatedCourse,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while creating Rating .Please try again later",
    });
  }
};

// getAverageRating

exports.getAverageRating = async (req, res) => {
  try {
    // get course id
    const courseId = req.body.courseId;
    // calculate avg rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    // return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Average Rating",
        averageRating: result[0].averageRating,
      });
    }
    // if no rating and review exist
    return res.status(200).json({
      success: true,
      message: "Average Rating 0, no rating given till now",
      averageRating: 0,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// getAllRating

exports.getAllRating = async (req, res) => {
  try {
    // get all rating and review
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "User",
        select: "firstName lastName email image",
      })
      .populate({
        path: "Course",
        select: "courseName",
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
    });
  } catch (err) {
    console.log(err);
  }
};
