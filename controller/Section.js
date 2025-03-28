const Course = require("../models/Course");
const Section = require("../models/Section");
const subSection = require("../models/SubSection");

// create section
exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;
    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });
    // update course with object id
    const updateCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { sections: newSection._id },
      },
      { new: true }
    )
      //  Use  section and subsection to replace section and subsection details
      .populate("section")
      .exec();
    // return response
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      updateCourseDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unable to create Section, please try again",
      error: err.message,
    });
  }
};
// update section

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId } = req.body;
    // data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    // return res
    return res.status(200).json({
      success: true,
      message: "Section Updated successfully",
    });
  } catch (err) {
    console.log(err);
  }
};
// delete section
// DELETE a section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not Found",
      });
    }

    //delete sub section
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
