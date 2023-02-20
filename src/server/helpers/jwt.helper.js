import jwt from "jsonwebtoken";
import User from "server/models/User";

const options = {
  expiresIn: "24h",
};

export const generateJwt = (username) => {
  try {
    const payload = { username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const validateTokenMiddleware = async (req, res, next) => {
  const auhorizationHeader = req.headers.authorization;
  let result;

  if (!auhorizationHeader) {
    return res.status(401).json({
      message: "Access token is missing",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    let user = await User.findOne({
      access_token: token,
    });

    if (!user) {
      return res.status(403).json({
        message: "Authorization error",
      });
    }

    result = jwt.verify(token, process.env.JWT_SECRET, options);

    if (!user.email === result.username) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    
    req.decodedJwt = result;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        message: "Token expired",
      });
    }

    return res.status(403).json({
      message: "Authentication error",
    });
  }
};
