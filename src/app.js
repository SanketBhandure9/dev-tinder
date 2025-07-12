const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { UserModel } = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Sanket",
    lastName: "Bhandure",
    emailId: "sanket@bhandure.com",
    password: "Sanket@15",
  };

  const user = new UserModel(userObj);

  try {
    await user.save();
    res.send("User Added successfully...");
  } catch (err) {
    res.status(400).send("Error while saving the user: " + err.message);
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
