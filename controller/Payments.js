const { instance } = require("../config/Razorpay");

const Course = require("../models/Course");

const User = require("../models/User");

const mailSender = require("../utils/mailSender");

const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");

// capture the payment and initiate the order of razorypay

exports.capturePayment = async (req, res) => {
  try {
    // get course id and user id
    const userId = req.user.id;
    const courseId = req.body.courseId;
    // validation
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course id",
      });
    }

    // valid course details
    try {
      let course = await Course.findById(courseId);
      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Could not find the course",
        });
      }
      // check user already paid  same course or not
      const uid = mongoose.Types.ObjectId(userId);
      if (course.studentEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: "Stundent  is already enrolled",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    // order create
    const amount = course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      reciept: Math.random(Date.now().toString()),
      notes: {
        courseId: courseId,
        userId,
      },
    };

    try {
      const paymentResponse = await instance.order.create(options);
      console.log(paymentResponse);

      // return res
      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDetails: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Could not initiate order",
    });
  }
};

// verify signature of razorpay and server

exports.verifySignature = async (req, res) => {
  const webhookSecret = "123456";
  const signature = req.headers["x-razorpay-signature"];
  //   step a:-
  const shaSum = crypto.createHmac("sha256", webhookSecret); //hmac object

  //  step b:- convert into string
  shaSum.update(JSON.stringify(req.body));
  //   step c:- create digest
  const digest = shaSum.digest("hex");
  //   match the signature
  if (signature === digest) {
    console.log("payment is Authorised");

    const { courseId, userId } = req.body.payload.payment.entity.notes;
    try {
      // fulfill the action
      // find the course ad enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );
      //     validation
      if (!enrolledCourse) {
        return res.status(400).json({
          success: false,
          message: "Course Not Found",
        });
      }
      console.log(enrolledCourse);

      //     find the student and added the course to their list of enrolled courses
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);

      //     mail send for confirmation
      const confirmMail = await mailSender(
        enrolledStudent.email,
        "Congratulations from Rohit Kumar",
        "Congratulations! ,you are onboarded into our New Course"
      );
      console.log(confirmMail);
      //     send the response back to the server
      return res.status(200).json({
        success: true,
        message: "Signature Verified and Course Added Successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid Request",
    });
  }
};
