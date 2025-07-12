const mongoose = require("mongoose");

const URI =
  "mongodb+srv://sanket_bhandure:nGJgsmia6xgseV6A@cluster0.bbak75u.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(URI);
};

module.exports = { connectDB };
