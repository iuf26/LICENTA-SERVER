import bcrypt from "bcrypt";
import mongoose, { mongo } from "mongoose";
import User from "server/models/User";
import UserOtpVerification from "server/models/UserOtpVerification";

const comparePasswords = async (plaintextPassword, hash) => {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
};

export const add = (req, res) => {
  const user = new User(req.body);
  user.save((err, answer) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(answer);
    }
  });
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
    //Password Hashing
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user
          .save()
          .then(res.status(201).send("Successful registration!"))
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
    return res.status(200).json({message: "Successful login!"});
  }
  return res.status(400).send("Wrong credentials!");
};
