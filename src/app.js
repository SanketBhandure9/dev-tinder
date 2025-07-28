const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { initialiseSocket } = require("./utils/socket");
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initialiseSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection success...");
    server.listen(3000, () => {
      console.log("Server is successfully listening to port 3000...");
    });
  })
  .catch(() => {
    console.log("Database connection failure...");
  });
