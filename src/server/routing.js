import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import fs from "fs";
import { sendMessage } from "server/rabbitmq/producer.js";
import {
  establishDbConnection,
  closeDbConnection,
} from "server/helpers/mongo-connection.js";

const clients = new Map();
const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: "*", // `${process.env.CLIENT_DOMAIN}:${process.env.CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});

(async () => {
  function defineRoutes() {
    app.get("/stream", (req, res) => {
      const file = fs.createReadStream(
        "src/server/tracks/Adele-LoveInTheDark.mp3"
      );
      res
        .set({
          "Content-Type": "audio/mp3",
          "Transfer-Encoding": "chunked",
        })
        .status(200);
      file.pipe(res);

      req.on("close", () => {
        console.log("Finished track");
        res.end();
      });
    });

    app.get("/user", (req, res) => {});
    
  }

  function prepareSocketForClientConnection() {
    io.on("connection", (socket) => {
      console.log("New listener connected");
      console.log(socket.id);
      console.log({ clients });
    });
  }

  server.listen(process.env.SERVER_PORT, () => {
    dotenv.config();
    console.log(`Listening on port ${process.env.SERVER_PORT}`);
    prepareSocketForClientConnection();
    establishDbConnection();
    defineRoutes();
  });

  server.on("close", () => {
    console.log("Server closed");
    closeDbConnection();
  });
})();
export {};
