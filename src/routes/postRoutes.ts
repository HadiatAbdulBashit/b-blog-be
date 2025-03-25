import { Hono } from "hono";
import { getAllPosts, createPost, getPostById, updatePost, deletePost, getAllMyPosts } from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware";

const postRoutes = new Hono();

postRoutes.get("/", getAllPosts);
postRoutes.get("/my", authMiddleware, getAllMyPosts);
postRoutes.post("/", authMiddleware, createPost);
postRoutes.get("/:id", getPostById);
postRoutes.put("/:id", authMiddleware, updatePost);
postRoutes.delete("/:id", authMiddleware, deletePost);

export default postRoutes;
