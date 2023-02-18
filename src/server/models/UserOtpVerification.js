import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const UserOtpVerificationSchema = new Schema({
  user_email: String,
  otp: String,
  created_at: Date,
  expires_at: Date,
});

const UserOtpVerification = mongoose.model(
  "user_otp_verification",
  UserOtpVerificationSchema
);

export default UserOtpVerification;
