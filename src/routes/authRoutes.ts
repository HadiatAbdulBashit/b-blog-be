import { Hono } from "hono";
import { register, login, logout } from "../controllers/authController.js";

const authRoutes = new Hono();
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
