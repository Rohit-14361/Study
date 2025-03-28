const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const dotenv = require("dotenv");

// create
exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req.body
    const { sectionId, title, description, timeDuration } = req.body;
    // extract file/video
    const video = req.files.video;
    // validation
    if (!sectionId || !title || !description || !timeDuration || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // create a sub section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // upload section with this sub section ObjectId
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subSections: subSectionDetails._id },
      },
      { new: true }
    ).populate("subSection");
    // find updated section and return it

    // return response
    return res.status(200).json({
      success: true,
      message: "Sub Section created successfully",
      data: updatedSection,
    });
  } catch (er) {
    res.status(500).json({ success: false, message: er.message });
  }
};
// update
exports.updatedSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }
    if (title !== undefined) {
      subSection.title = title;
    }
    if (descriptiom !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      // delay something
      subSection.timeDuration = uploadDetails.duration; // get duration from cloudinary
    }
    await subSection.save();
    // find the section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    console.log("updated SubSection", updatedSection);
    return res.json({
      success: true,
      message: "Sub Section updated Successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};
// delete subsection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    // delete from section
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: { subSection: subSectionId },
      }
    );
    // delete from subsection
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }
    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    return res.json({
      success: true,
      message: "SubSection deleted Successfully",
      data: updatedSection,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};
