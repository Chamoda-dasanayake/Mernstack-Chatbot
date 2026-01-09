import { Router} from "express";
import { getAllUsers, userLogin, userLogout, userSignup, verifyUser } from "../controllers/user-controller.js";
import { loginValidator, signupValidator, validate } from "../utils/Validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();

// 1. Status Route (FOR TESTING)
// URL: http://localhost:5000/api/v1/user/status
userRoutes.get("/status", (req, res) => {
  return res.status(200).json({ message: "Backend is Running Successfully" });
});

// 2. Admin Route
userRoutes.get("/", getAllUsers);

// 3. Signup Route
userRoutes.post("/signup", validate(signupValidator), userSignup);

// 4. Login Route
userRoutes.post("/login", validate(loginValidator), userLogin);

// 5. Auth Check (Used by Frontend to check if cookie is valid)
userRoutes.get("/auth-status", verifyToken, verifyUser);

// 6. Logout Route
userRoutes.get("/logout", verifyToken, userLogout);

export default userRoutes;