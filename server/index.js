import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import queue from "./queue.js";
import dotenv from "dotenv";
dotenv.config();

const clients = new Map();
const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: `${process.env.CLIENT_DOMAIN}:${process.env.CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});
(async () => {
  function defineRoutes() {
    app.get("/stream", (req, res) => {
        console.log(req.query.client_id);
     // const { id, client } = queue.addClient();

      res
        .set({
          "Content-Type": "audio/mp3",
          "Transfer-Encoding": "chunked",
        })
        .status(200);

      //client.pipe(res);

      req.on("close", () => {
        queue.removeClient(id);
      });
    });
  }
  function prepareSocketForClientConnection() {
    io.on("connection", (socket) => {
      console.log("New listener connected");
      console.log(socket.id);
      clients.set(socket.id,1)
      console.log({clients});
    });
  }
  server.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`);
    prepareSocketForClientConnection();
    defineRoutes()
  });
})();
export {};
