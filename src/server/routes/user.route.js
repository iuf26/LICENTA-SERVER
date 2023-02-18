import express from "express";
import * as userController from "server/controllers/user.controller";
import path from "path";

const router = express.Router();

router.get("/login", userController.login);
router.post("/register", userController.register);
router.get("/verify/:userId/:otp", userController.verify);
router.get("/confirmation", (req, res) => {
    res.sendFile(path.join(__dirname, "../../views/confirm-email.html"))
});

export { router as userRoute };
