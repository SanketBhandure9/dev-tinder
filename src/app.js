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
