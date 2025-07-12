const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { UserModel } = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new UserModel(req.body);

  try {
    await user.save();
    res.send("User Added successfully...");
  } catch (err) {
    res.status(400).send("Error while saving the user: " + err.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await UserModel.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found :(");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong - " + err.message);
  }
});

// Feed API, GET /feed - get all users from database
app.get("/feed", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong - " + err.message);
  }
});

// Delete user from database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    // const user = await UserModel.findByIdAndDelete({ _id: userId });
    const user = await UserModel.findByIdAndDelete(userId);
    res.send("User deleted successfully...");
  } catch (err) {
    res.status(400).send("Error while deleting the user: " + err.message);
  }
});

// Update user from database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills"];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 30) {
      throw new Error("Skills cannot be more than 30");
    }
    await UserModel.findByIdAndUpdate(userId, data);
    res.send("User updated successfully...");
  } catch (err) {
    res.status(400).send("Error while updating the user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection success...");
    app.listen(3000, () => {
      console.log("Server is successfully listening to port 3000...");
    });
  })
  .catch(() => {
    console.log("Database connection failure...");
  });
