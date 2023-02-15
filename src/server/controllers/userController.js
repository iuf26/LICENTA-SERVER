import mongoose, { mongo } from "mongoose";
import { userSchema } from "server/models/User";

const User = mongoose.model("User", userSchema);

const add = (req, res) => {
  const user = new User(req.body);
  user.save((err, answer) => {
    if (err) {
      res.send(err);
    } else {
      res.send(answer);
    }
  });
};

const getAll = (req, res) => {
  Student.find({}, (err, answer) => {
    if (err) {
      res.send(err);
    } else {
      res.send(answer);
    }
  });
};

export { add, getAll };
