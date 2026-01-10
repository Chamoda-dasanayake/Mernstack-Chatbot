import { Router } from "express";
import { getAllUsers, userLogin, userLogout, userSignup, verifyUser } from "../controllers/user-controller.js";
import { loginValidator, signupValidator, validate } from "../utils/Validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();

userRoutes.get("/status", (req, res) => {
  return res.status(200).json({ message: "Backend is Running Successfully" });
});

//  Admin Route
userRoutes.get("/", getAllUsers);

// Signup Route
userRoutes.post("/signup", validate(signupValidator), userSignup);

//  Login Route
userRoutes.post("/login", validate(loginValidator), userLogin);

// Auth Check (Used by Frontend to check if cookie is valid)
userRoutes.get("/auth-status", verifyToken, verifyUser);

// Logout Route
userRoutes.get("/logout", verifyToken, userLogout);

export default userRoutes;