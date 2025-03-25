import { Hono } from "hono";
import { register, login, logout, getUserInfo } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRoutes = new Hono();
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/my-info", authMiddleware, getUserInfo);

export default authRoutes;
