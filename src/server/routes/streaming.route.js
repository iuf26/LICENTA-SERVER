import express from "express";
import fs from "fs";
import SpotifyWebApi from "spotify-web-api-node";
import got from "got";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});
const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-modify-public",
  "playlist-modify-private",
];

// spotifyApi.clientCredentialsGrant().then(
//   function (data) {
//     console.log("The access token expires in " + data.body["expires_in"]);
//     console.log("The access token is " + data.body["access_token"]);

//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body["access_token"]);
//   },
//   function (err) {
//     console.log(
//       "Something went wrong when retrieving an access token",
//       err.message
//     );
//   }
// );

const router = express.Router();
router.get("/track", (req, res) => {
  const file = fs.createReadStream("src/server/tracks/Adele-LoveInTheDark.mp3");
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

router.get("/spotify/track", async (req, res) => {
  spotifyApi
    .getTrack("0lJrPatloYarTbsKciShJu")
    .then((resp) => {
      console.log({ melody: resp });

      res
        .set({
          "Content-Type": "audio/mp3",
          "Transfer-Encoding": "chunked",
        })
        .status(200);
      got.stream(resp.body.preview_url).pipe(res);

      req.on("close", () => {
        console.log("Finished track");
        res.end();
      });
    })
    .catch((err) => {
      console.log(err);
      res.end("error");
    });
});

router.get("/spotify/login", (req, res) => {
  var html = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(html + "&show_dialog=true");
});

router.get("/spotify/callback", async (req, res) => {
  const { code } = req.query;
  console.log(code);
  try {
    var data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    console.log({ access_token, refresh_token });

    res.redirect("http://localhost:3000/home");
  } catch (err) {
    res.redirect("/#/error/invalid token");
  }
});

export { router as streamingRoute };
