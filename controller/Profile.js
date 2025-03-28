const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    // get
    const { contactNumber, gender, about = "", dateOfBirth = "" } = req.body;
    // getuserId
    const userId = req.user.id;
    // validation
    if (!contactNumber || !gender || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //     find user detail
    const userDetails = await User.findById(userId);

    // findProfileId
    const profileId = userDetails.additionalDetails;
    //find profile details
    const profileDetails = await Profile.findById(profileId);
    //     update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();
    // return  response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while updating Profile . Please try again later",
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const userId = req.user.id;
    const userDetails = await User.findById(userId);
    // validation
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // delete Profile
    const deleteProfile = await Profile.findByIdAndDelete({
      _id: userDetails.additionalDetails,
    });

    // delete user
    await User.findByIdAndDelete({ _id: userId });
    // TODO:-unenroll user from all enrolled courses
    // response
    return res.status(200).json({
      success: true,
      message: "Account Deleted successfully",
    });
    //TODO:- How can we schedule a request or Task scehduling or Crone job
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while deleting Profile . Please try again later",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    //get id

    const id = req.user.id;
    // validation and get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // return res
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      userDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while fetched user details. Please try again later",
    });
  }
};

// update display profile picture

exports.updatedProfileDetails = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;
    // get profile image from req.body

    const profileImage = req.files.profileImage;

    const image = await uploadImageToCloudinary(
      profileImage,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);

    // update the user details witb profile
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );

    // return res
    return res.status(203).json({
      success: true,
      message: "Image updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.log(err);
  }
};
// get all  enrolled course

exports.getEnrolledCourses = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;
    // get user details and populate courses of a particular user
    const userDetails = await User.findById(userId).populate("courses");
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not found user with id ${userDetails} `,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Details fetched successfully",
      userDetails,
    });
  } catch (err) {
    console.log(err);
  }
};
