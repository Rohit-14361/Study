const jwt = require("jsonwebtoken");

exports.createToken = async (payload) => {
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  } catch (err) {
    console.log(err);
  }
};

exports.verifyToken = async (payload) => {
  try {
    const decoded = await jwt.verify(payload, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.log(err);
  }
};
