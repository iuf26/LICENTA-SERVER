import express from "express";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Server as IOServer } from "socket.io";
import { userRoute } from "server/routes/user.route";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: `${process.env.CLIENT_ROOT}`,
    methods: ["GET", "POST", "PUT"],
  },
});
const prepareSocketForClientConnection = () => {
  io.on("connection", (socket) => {
    console.log("New listener connected");
    //console.log(socket.id);
    //console.log({ clients });
  });
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use("/user", userRoute);
//MongoDB connection
const database = process.env.MONGO_URL;
mongoose.set("strictQuery", true);
mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.log(err));

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Listening on port ${process.env.SERVER_PORT}`);
  io.on("connection", (socket) => {
    console.log("New listener connected");
    console.log(socket.id);
  });
  prepareSocketForClientConnection();
});

server.on("close", () => {
  console.log("Server closed");
  closeDbConnection();
});
