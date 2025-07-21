const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");
const mongoose = require("mongoose");

// const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills";
const USER_SAFE_DATA = {
  _id: 1,
  firstName: 1,
  lastName: 1,
  age: 1,
  gender: 1,
  about: 1,
  skills: 1,
  photoUrl: 1,
};

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    if (!connectionRequests || connectionRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No connection requests found :(" });
    }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const modifiedData = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data: modifiedData });
  } catch (err) {
    res.status(400).sned({ message: err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Step 1: Get list of all users connected/requested with logged-in user
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // Step 2: Create a Set of user IDs to exclude from feed
    const excludedUserIds = new Set();
    connectionRequests.forEach((req) => {
      excludedUserIds.add(req.fromUserId.toString());
      excludedUserIds.add(req.toUserId.toString());
    });
    excludedUserIds.add(loggedInUser._id.toString()); // Exclude self

    const excludeIds = Array.from(excludedUserIds).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Step 3: Use aggregation to apply filtering and pagination
    const pipeline = [
      {
        $match: {
          _id: { $nin: excludeIds },
        },
      },
      {
        $project: USER_SAFE_DATA, // Make sure USER_SAFE_DATA is a valid projection object
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const users = await UserModel.aggregate(pipeline);

    // Step 4: Get total count (for pagination)
    const total = await UserModel.countDocuments({
      _id: { $nin: excludeIds },
    });

    res.json({
      data: users,
      page,
      limit,
      total,
      hasMore: skip + users.length < total,
    });
  } catch (err) {
    console.error("Feed Error:", err);
    res.status(400).send("ERROR: " + err.message);
  }
});

// DELETE /user/connection/:userId - Remove a connection
userRouter.delete(
  "/user/connection/remove/:userId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const otherUserId = req.params.userId;

      // Find and delete the accepted connection request between the two users
      const deleted = await ConnectionRequestModel.findOneAndDelete({
        $or: [
          {
            fromUserId: loggedInUserId,
            toUserId: otherUserId,
            status: "accepted",
          },
          {
            fromUserId: otherUserId,
            toUserId: loggedInUserId,
            status: "accepted",
          },
        ],
      });

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Connection not found or not accepted." });
      }

      res.json({ message: "Connection deleted successfully." });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = userRouter;
