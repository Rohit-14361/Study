const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;
    //     validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //     create entry
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while creating Tag",
    });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "All Category fetched successfully",
      data: allCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while fetching Category",
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    // get category id
    const categoryId = req.body.categoryId;
    // get courses for specified categoryid
    const selectedCatgory = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    // validation
    if (!selectedCatgory) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }
    //get courses for diffrent categories
    const diffrentCategory = await Category.find({ _id: { $ne: categoryId } })
      .populate("courses")
      .exec();
    //get 10 top selling courses
    const topSellingCourse = await Course.find()
      .sort({ views: -1 })
      .limit(3)
      .exec();
    // return res
    return res.status(200).json({
      success: true,
      data: {
        selectedCatgory,
        diffrentCategory,
        topSellingCourse,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
