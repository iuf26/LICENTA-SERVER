import User from "server/models/User";

export const getSpotifyRefreshedAccesToken = (refreshToken, spotifyApi) => {
  spotifyApi.setRefreshToken(refreshToken);
  return spotifyApi.refreshAccessToken(); //resp.body.access_token
};

export const validateSpotifyAccesToken = async (req, res, next) => {};

export const extractSpotifyRefreshToken = async (req, res, next) => {
  const { username } = res.locals.decodedJwt;
  const spotifyRefreshAccesToken = User.find({ email: username });
  res.locals.spotifyRefreshAccesToken = spotifyRefreshAccesToken;
  next();
};
