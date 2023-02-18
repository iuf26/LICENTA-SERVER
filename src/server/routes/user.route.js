import express from "express";
import * as userController from "server/controllers/user.controller";

const router = express.Router();

router.get("/login", userController.login);
router.post("/register", userController.register);

export { router as userRoute };
