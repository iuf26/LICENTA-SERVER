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
  created_date:{
    type: Date,
    default: Date.now()
},
});
