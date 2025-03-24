import { Hono } from "hono";
import { createComment, updateComment, deleteComment, getAllComments } from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

const commentRoutes = new Hono();

commentRoutes.get("/:postId", getAllComments);
commentRoutes.post("/", authMiddleware, createComment);
commentRoutes.put("/:id", authMiddleware, updateComment);
commentRoutes.delete("/:id", authMiddleware, deleteComment);

export default commentRoutes;
