import express from "express";
import * as userController from "server/controllers/userController";

const router = express.Router();

router.get("/login", userController.login);
router.post("/register", userController.register);

export { router as userRoute };
