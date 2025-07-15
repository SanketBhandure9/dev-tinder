const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookies
    const { token } = req.cookies;
    if (!token) {
      throw res.status(401).send("Please login");
    }

    // Validate token
    const decodedObj = await jwt.verify(token, "dev@tinder");
    const { _id } = decodedObj;

    // Find the user
    const user = await UserModel.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
