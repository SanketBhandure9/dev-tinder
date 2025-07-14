const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age gender about skills");
    // }).populate("fromUserId", ["firstName", "lastName"]);

    if (!connectionRequests) {
      return res
        .status(404)
        .json({ message: "No connection requets found :(" });
    }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
