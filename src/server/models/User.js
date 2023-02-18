import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const userSchema = new Schema({
  email: {
    type: String,
    required: "Enter email",
  },
  password: {
    type: String,
    required: "Enter password",
  },
  permissions: {
    type: Object,
    default: ["user"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("users", userSchema);

export default User;
