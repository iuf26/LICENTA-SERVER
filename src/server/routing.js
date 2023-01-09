import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import fs from "fs";
import { sendMessage } from "#root/src/server/rabbitmq/producer.js";

dotenv.config();

const clients = new Map();
const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin:'*',// `${process.env.CLIENT_DOMAIN}:${process.env.CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});
(async () => {
  //await queue.loadTracks("D:/LICENTA/licenta-server/server/tracks");
  // queue.play();
  function defineRoutes() {
    app.get("/stream", (req, res) => {
      //const { id, client } = queue.addClient();
      const file = fs.createReadStream("src/server/tracks/Adele-LoveInTheDark.mp3");
      //sendMessage("Preparing file to read","info")
      // file.on("data", (chunk) => {
      //   res.send(chunk);
      // });
      res
        .set({
          "Content-Type": "audio/mp3",
          "Transfer-Encoding": "chunked",
        })
        .status(200);
        file.pipe(res)

      req.on("close", () => {
        //  queue.removeClient(id);
        console.log("Finished track")
        //sendMessage("Request is closed","error")
        res.end();
      });
    });
  }
  function prepareSocketForClientConnection() {
    io.on("connection", (socket) => {
      console.log("New listener connected");
      console.log(socket.id);

      console.log({ clients });
    });
  }
  server.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`);
    prepareSocketForClientConnection();
    defineRoutes();
  });
})();
export {};
