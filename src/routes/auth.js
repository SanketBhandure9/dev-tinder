const express = require("express");
const { UserModel } = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    // encryption of data
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    // validation of data
    validateSignUpData(req);

    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token);

    res.json({ message: "User Added successfully...", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await UserModel.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create JWT token
      const token = await user.getJWT();

      // Add the token to cookie and send response back to client
      res.cookie("token", token);

      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .send("Logged out successfully");
  } catch (err) {}
});

authRouter.delete("/delete-account", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    // Delete all related connection requests
    const { ConnectionRequestModel } = require("../models/connectionRequest");
    await ConnectionRequestModel.deleteMany({
      $or: [
        { fromUserId: userId },
        { toUserId: userId },
      ],
    });
    // Delete the user
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found or already deleted." });
    }
    // Clear the token cookie
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.json({ message: "Account and all related connections deleted successfully." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = authRouter;
