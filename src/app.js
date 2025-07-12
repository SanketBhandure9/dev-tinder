const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { UserModel } = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { firstName, lastName, emailId, password } = req.body;
    console.log("first", firstName);

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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await UserModel.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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
    const ALLOWED_UPDATES = [
      "firstName",
      "emailId",
      "photoUrl",
      "about",
      "skills",
    ];

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
