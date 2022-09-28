import express from "express";
import { logOut, signin, signup } from "../controllers/auth.js"

const router = express.Router();

//CREATE A USER
router.post("/signup", signup);

//SIGN IN
router.post("/signin", signin);

router.get("/logout", logOut)
//GOOGLE AUTH
// router.post("/google", googleAuth )

export default router; 