import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server as IOServer } from "socket.io";
import { userRoute } from "server/routes/user";

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: "*", // `${process.env.CLIENT_DOMAIN}:${process.env.CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});

dotenv.config();

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Listening on port ${process.env.SERVER_PORT}`);
  io.on("connection", (socket) => {
    console.log("New listener connected");
    console.log(socket.id);
    console.log({ clients });
  });
  app.use("/", userRoute);
  // prepareSocketForClientConnection();
  // establishDbConnection();
});

server.on("close", () => {
  console.log("Server closed");
  closeDbConnection();
});
