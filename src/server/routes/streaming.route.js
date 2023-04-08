import express from "express";
import fs from "fs";
import got from "got";
import axios from "axios";
import {
  extractSpotifyRefreshToken,
  requestSpotifyRefreshedAccesToken,
} from "server/helpers/streaming.helper";
import { request } from "http";
import { DateTime } from "luxon";
import User from "server/models/User";
import { hashCredentials } from "server/helpers/authorization.helper";
import {
  generateJwt,
  validateTokenMiddleware,
} from "server/helpers/jwt.helper";
import { sendResponse, SUCCESS } from "server/helpers/response.helper";
import * as streamingController from "server/controllers/streaming.controller";
import { spotifyApi, scopes } from "server/controllers/streaming.controller";

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

router.get("/spotify/login/:userId", (req, res) => {
  const { userId } = req.params;
  let html = spotifyApi.createAuthorizeURL(scopes);
  res.cookie("userId", userId, {
    path: "/",
    expires: DateTime.now().plus({ minutes: 1 }).toJSDate(),
  });
  html = `${html}&show_dialog=true`;
  sendResponse(res, 200, "Redirect succes", SUCCESS, { redirectLink: html });
});

router.get("/spotify/callback", async (req, res) => {
  const { code } = req.query;
  const userId = req.cookies.userId;
  console.log({ userId });
  try {
    var data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    //save refresh acces token
    const token = generateJwt(userId, access_token);
    await User.findOneAndUpdate(
      { email: userId },
      { spotify_acces_token: access_token },
      { spotify_refresh_token: refresh_token }
    );
    await User.findOneAndUpdate(
      { email: userId },
      { acces_token: token, spotify_verified: true }
    );

    res.cookie("token", token, {
      path: "/",
      expires: DateTime.now().plus({ days: 2 }).toJSDate(),
    });
    res.cookie("isSpotifyAuth", true, {
      path: "/",
    });
    //sendResponse(res, 200, "Spotify account succesfully added!", SUCCESS);
    res.redirect(`${process.env.CLIENT_ROOT}/home`);
  } catch (err) {
    res.redirect("/#/error/invalid token");
  }
});

router.get(
  "/spotify/new-realises",
  [validateTokenMiddleware, extractSpotifyRefreshToken],
  (req, res) => {
    const { username, spotifyToken } = res.locals.decodedJwt;
    const spotifyRefreshAccesToken = res.locals.spotifyRefreshAccesToken;
    console.log({ username, spotifyToken, spotifyRefreshAccesToken });
    spotifyApi.setAccessToken(spotifyToken);
    spotifyApi.setRefreshToken(spotifyRefreshAccesToken);
  }
);

router.post(
  "/spotify/recommandations/:userId",
  [validateTokenMiddleware, extractSpotifyRefreshToken],
  streamingController.getMusicRecommandations
);

router.post(
  "/spotify/playlist/:userId",
  [validateTokenMiddleware, extractSpotifyRefreshToken],
  streamingController.createSpotifyPlaylist
);

router.post(
  "/spotify/playlist/tracks/:playlistId",
  [validateTokenMiddleware, extractSpotifyRefreshToken],
  streamingController.addPlaylistTracks
);

router.get(
  "/spotify/artists-ids",
  [validateTokenMiddleware, extractSpotifyRefreshToken],
  streamingController.saveArtistsIds
);

export { router as streamingRoute };
