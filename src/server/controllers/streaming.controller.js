import { artistIds } from "server/helpers/artistIds";
import { artists, saveArtistsIdsFromSpotifyApis } from "server/helpers/artists";
import { ERROR, sendResponse, SUCCESS } from "server/helpers/response.helper";
import {
  refreshAccesTokenForUser,
  refreshSpotifyAccesTokenForUser,
} from "server/helpers/streaming.helper";
import User from "server/models/User";
import SpotifyWebApi from "spotify-web-api-node";

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-modify-public",
  "playlist-modify-private",
];

const getArtistsNamesFromText = ({ text, words }) => {
  //This function could be optimized

  const artistsFound = [];
  let result;
  text = text.toLowerCase();
  artists.forEach(function (artist) {
    const regexp = new RegExp(
      "\\b" + artist.toLowerCase().replace(/\./g, "\\.") + "\\b"
    );

    if (regexp.exec(text) !== null) {
      artistsFound.push(artist);
    }
  });

  console.log({ artistsFound });
  artistsFound.forEach((artist) => {
    if (result) {
      result = `${result},${artistIds[artist]}`;
    } else {
      result = `${artistIds[artist]}`;
    }
  });

  return { result, artistsFound };
};

export const getMusicRecommandations = async (req, res) => {
  const { detectedEmotion, loudness, tempo, text, words } = req.body;
  const { userId } = req.params;
  const { spotify_refresh_token, spotify_acces_token } = await User.findOne({
    email: userId,
  });
  //const seed_artists = "5YGY8feqx7naU7z4HrwZM6,6n7nd5iceYpXVwcx8VPpxF";
  let result, artistsFound;
  if (text) {
    const res = getArtistsNamesFromText({ text, words });
    result = res.result;
    artistsFound = res.artistsFound;
  }
  const seed_genres = detectedEmotion;
  const seed_tracks = "3AAY8YicetRPlDAkibHLiS";
  const max_loudness = loudness;
  const max_tempo = tempo;
  let recommendation;
  spotifyApi.setAccessToken(spotify_acces_token);
  spotifyApi.setRefreshToken(spotify_refresh_token);
  console.log({ result });
  try {
    let body;
    if (!result) {
      body = {
        seed_genres,
      };
    } else {
      body = {
        seed_genres,
        seed_artists: result,
        // max_loudness,
        // max_tempo,
      };
    }

    recommendation = await spotifyApi.getRecommendations(body);
    artistsFound = artistsFound.join();
    return sendResponse(res, 200, "Music Recommandations retrieved", SUCCESS, {
      recommendation,
      artistsFound,
    });
  } catch (error) {
    if (error.statusCode === 401) {
      //token expired
      console.log("before refresh..");
      const response = await refreshSpotifyAccesTokenForUser(
        userId,
        spotifyApi
      );
      if (response) {
        console.info("Access token for spotify api is refreshed");
        const { spotify_acces_token } = await User.findOne({ email: userId });
        spotifyApi.setAccessToken(spotify_acces_token);

        recommendation = await spotifyApi.getRecommendations({
          seed_artists,
          seed_genres,
          seed_tracks,
          max_loudness,
          max_tempo,
        });

        return sendResponse(
          res,
          200,
          "Music Recommandations retrieved",
          SUCCESS,
          {
            recommendation,
          }
        );
      } else {
        console.info("Could not refresh access token");
      }
    }
  }
};

export const createSpotifyPlaylist = async (req, res) => {
  const { userId } = req.params;
  const { playlistName } = req.body;
  const { spotify_refresh_token, spotify_acces_token } = await User.findOne({
    email: userId,
  });
  spotifyApi.setAccessToken(spotify_acces_token);
  spotifyApi.setRefreshToken(spotify_refresh_token);
  try {
    const response = await spotifyApi.createPlaylist(playlistName, {
      public: true,
      description: "Listen Up!",
    });
    const playlistId = response.body.id;
    console.log({ playlistId });
    return sendResponse(res, 200, "Playlist created", SUCCESS, {
      playlistId,
    });
  } catch (error) {
    console.info({ error: err });
    return sendResponse(res, 505, "Could not create playlist", ERROR);
  }
};

const retrieveSpotifyCredentialsForUser = async ({ email }) => {
  const { spotify_refresh_token, spotify_acces_token } = await User.findOne({
    email,
  });

  return { spotify_refresh_token, spotify_acces_token };
};

export const addPlaylistTracks = async (req, res) => {
  const { playlistId } = req.params;
  //tracks, list of strings representing spotify's track uri
  const { tracks, userId } = req.body;
  const { spotify_refresh_token, spotify_acces_token } =
    await retrieveSpotifyCredentialsForUser({ email: userId });

  spotifyApi.setAccessToken(spotify_acces_token);
  spotifyApi.setRefreshToken(spotify_refresh_token);

  console.log({ playlistId });

  try {
    console.info("Tracks successfully added to playlist");
    await spotifyApi.addTracksToPlaylist(playlistId, tracks);
    return sendResponse(res, 200, "Added tracks to playlist", SUCCESS, {
      playlistId,
    });
  } catch (error) {
    console.info(error);
    return sendResponse(res, 505, "Could not add track to playlist", ERROR);
  }
};

export const saveArtistsIds = async (req, res) => {
  await saveArtistsIdsFromSpotifyApis(spotifyApi);
  res.end();
};
