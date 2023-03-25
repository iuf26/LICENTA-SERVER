import User from "server/models/User";

export const getSpotifyRefreshedAccesToken = (refreshToken, spotifyApi) => {
  spotifyApi.setRefreshToken(refreshToken);
  return spotifyApi.refreshAccessToken(); //resp.body.access_token
};

export const validateSpotifyAccesToken = async (req, res, next) => {};

export const extractSpotifyRefreshToken = async (req, res, next) => {
  const { username } = res.locals.decodedJwt;
  const { spotify_refresh_token } = await User.findOne({ email: username });
  res.locals.spotifyRefreshAccesToken = spotify_refresh_token;
  next();
};

export const refreshSpotifyAccesTokenForUser = async (userId, spotifyApi) => {
  try {
    const { spotify_refresh_token } = await User.findOne({ email: userId });
    spotifyApi.setRefreshToken(spotify_refresh_token);
    const responseRefreshToken = await spotifyApi.refreshAccessToken();
    const freshAccessToken = responseRefreshToken.body.access_token;

    await User.findOneAndUpdate(
      { email: userId },
      {
        $set: { spotify_acces_token: freshAccessToken },
      }
    );
    return true;
  } catch (error) {
    console.info(error);
    return false;
  }
};
