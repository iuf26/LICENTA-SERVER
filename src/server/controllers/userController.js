import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import { userSchema } from "server/models/User";

const User = mongoose.model("users", userSchema);
const info = (message) => {
  return { info: message };
};
const error = (message) => {
  return { error: `ERROR: ${message}` };
};

export const add = (req, res) => {
  const user = new User(req.body);
  user.save((err, answer) => {
    if (err) {
      res.send(err);
    } else {
      res.send(answer);
    }
  });
};

export const getAll = (req, res) => {
  Student.find({}, (err, answer) => {
    if (err) {
      res.send(err);
    } else {
      res.send(answer);
    }
  });
};

export const register = (req, res) => {
  const { email, password, confirm } = req.body;

  if (!email || !password || !confirm) {
    res.send(info("Fill empty fields"));
  }
  if (password !== confirm) {
    res.send(info("Password must match"));
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      res.send(info("A user with this email already exists!"));
    } else {
      //Validation
      const user = new User({
        email,
        password,
      });
      //Password Hashing
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(res.send(info("Successful registration!")))
            .catch((err) => res.send(error(err)));
        })
      );
    }
  });
};
