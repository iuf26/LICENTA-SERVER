import express from "express";
import * as userController from "server/controllers/userController"

const router = express.Router();

router.get("/login", (req, res) => {
  res.send("You ve made a login request");
});
router.post("/register", userController.register);

export { router as userRoute };
