import { sendResponse, SUCCESS } from "server/helpers/response.helper";
import { refreshAccesTokenForUser, refreshSpotifyAccesTokenForUser } from "server/helpers/streaming.helper";
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

export const getMusicRecommandations = async (req, res) => {
  const { detectedEmotion, loudness, tempo } = req.body;
  const { userId } = req.params;
  const { spotify_refresh_token, spotify_acces_token } = await User.findOne({
    email: userId,
  });
  const seed_artists = "2WX2uTcsvV5OnS0inACecP,6n7nd5iceYpXVwcx8VPpxF";
  const seed_genres = detectedEmotion;
  const seed_tracks = "0BHfePcMkm1adhUeO3PLrI";
  const max_loudness = loudness;
  const max_tempo = tempo;
  let recommendation;
  spotifyApi.setAccessToken(spotify_acces_token);
  spotifyApi.setRefreshToken(spotify_refresh_token);

  try {
    recommendation = await spotifyApi.getRecommendations({
      seed_artists,
      seed_genres,
      seed_tracks,
      max_loudness,
      max_tempo,
    });
    return sendResponse(res, 200, "Music Recommandations retrieved", SUCCESS, {
      recommendation,
    });
  } catch (error) {
    console.info(error);
    if (error.statusCode === 401) {
      //token expired
      const response = await refreshSpotifyAccesTokenForUser(userId, spotifyApi);
      if (response) {
        console.info("Access token for spotify api is refreshed");
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
