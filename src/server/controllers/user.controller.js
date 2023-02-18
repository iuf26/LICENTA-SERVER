import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import mongoose, { mongo } from "mongoose";
import { sendVerificationEmail } from "server/helpers/mail.helper";
import User from "server/models/User";
import UserOtpVerification from "server/models/UserOtpVerification";

const comparePasswords = async (plaintextPassword, hash) => {
  return bcrypt.compare(plaintextPassword, hash);
};

export const getAll = (req, res) => {
  Student.find({}, (err, answer) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(answer);
    }
  });
};

export const register = (req, res) => {
  const { email, password, confirm } = req.body;
  //Validation
  if (!email || !password || !confirm) {
    return res.status(400).send("Fill empty fields");
  }
  if (password !== confirm) {
    return res.status(400).send("Password must match");
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).send("A user with this email already exists!");
    }
    const newUser = new User({
      email,
      password,
    });
    //Password Hashing
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((result) => {
            sendVerificationEmail(result, res);
          })
          .catch((err) => res.status(500).send(err));
      })
    );
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Fill empty fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("User does not exist!");
  }
  const passwordComparisonResult = await comparePasswords(
    password,
    user.password
  );
  if (passwordComparisonResult) {
    return res.status(200).json({ message: "Successful login!" });
  }
  return res.status(400).send("Wrong credentials!");
};

export const verify = (req, res) => {
  const { userId, otp } = req.params;
  UserOtpVerification.findOne({ user_id: userId })
    .then(async (result) => {
      if (!result) {
        res.status(404).json({ message: "Invalid verification link!" });
        return;
      }

      const { user_id, expires_at, otp: otpHashed } = result;
      const otpValidationResult = await comparePasswords(otp, otpHashed);

      if (!otpValidationResult) {
        res.status(404).json({ message: "Invalid verification link!" });
        return;
      }

      const currentTime = DateTime.utc();
      const expiresAt = DateTime.fromISO(expires_at).toUTC();
      console.log({otpHashed, user_id});
      if (currentTime <= expiresAt) {
        await User.findOneAndUpdate({ email: user_id }, { $set: { verified: true } });
        await UserOtpVerification.deleteOne({ user_id, otp: otpHashed });
        res.status(200).json({ message: "Successfully verified email!" });
        return;
      }
  
      await UserOtpVerification.deleteOne({ user_id, otp: otpHashed });
      res.status(410).json({ message: "Link for email verification expired!" });
      return;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Email verification failed!" });
    });
};
