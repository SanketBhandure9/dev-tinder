const express = require("express");
const { UserModel } = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
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

    await user.save();
    res.send("User Added successfully...");
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

module.exports = authRouter;
