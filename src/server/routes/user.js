import express from "express";

const router = express.Router();
router.get("/login", (req, res) => {
  res.send("You ve made a login request");
});
router.post("/register", (req, res) => {
  res.send("You ve made a register request");
});

export { router as userRoute };
