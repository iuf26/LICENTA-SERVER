import nodemailer from "nodemailer";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import UserOtpVerification from "server/models/UserOtpVerification";
import { renderFile } from "pug";
import path from "path";

export const sendVerificationEmail = ({ _id, email }, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  const serverRootUrl = `${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}`;
  const otp = v4() + _id;
  const confirmationLink = `${serverRootUrl}/user/verify/${email}/${otp}`;
  console.log({ confirmationLink });
  const html = renderFile(path.join(__dirname, "../../views/mail.pug"), {
    confirmationLink,
  });


  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Welcome to our community of music enthusiasts!",
    html: html,
  };

  //hash otp - one time password
  const salt = 10;
  bcrypt
    .hash(otp, salt)
    .then((hashedOtp) => {
      const userOtpVerification = new UserOtpVerification({
        user_id: email,
        otp: hashedOtp,
        created_at: DateTime.utc().toISO(),
        expires_at: DateTime.utc().plus({ days: 1 }).toISO(),
      });

      userOtpVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.status(200).json({
                message:
                  "Verification email sent and verification otp record saved!",
              });
            })
            .catch((error) => {
              res.status(500).json({
                message: "Email verification failed",
              });
            });
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Couldn't save verification email data!" });
        });
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "Error occurred while hashing email data!" });
    });
};
