import express from "express";

export const router = express.Router();
router.get("/stream", (req, res) => {
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