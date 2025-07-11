const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Don", lastName: "Bhandure" });
});

app.use("/hello", (req, res) => {
  res.send("Hello from Server :)");
});

app.listen(3000, () => {
  console.log("Server is successfully listening to port 3000...");
});
