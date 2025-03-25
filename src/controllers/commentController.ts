import { Context } from "hono";
import { prisma } from "../config/prismaClient.js";

export const getAllComments = async (c: Context) => {
  const { postId } = c.req.param();
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { author: { select: { name: true, id: true } } },
    orderBy: { createdAt: "asc" },
  });

  return c.json(comments);
};

export const createComment = async (c: Context) => {
  const { postId, content } = await c.req.json();
  const user = c.get("user");

  if (!content) return c.json({ error: "Content is required" }, 400);
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return c.json({ error: "Post not found" }, 404);

  const comment = await prisma.comment.create({
    data: { content, postId, authorId: user.id },
  });

  return c.json(comment, 201);
};

export const updateComment = async (c: Context) => {
  const { id } = c.req.param();
  const { content } = await c.req.json();
  const user = c.get("user");

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return c.json({ error: "Comment not found" }, 404);
  if (comment.authorId !== user.id) return c.json({ error: "Unauthorized access" }, 403);

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  return c.json(updatedComment);
};

export const deleteComment = async (c: Context) => {
  const { id } = c.req.param();
  const user = c.get("user");

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return c.json({ error: "Comment not found" }, 404);
  if (comment.authorId !== user.id) return c.json({ error: "Unauthorized access" }, 403);

  await prisma.comment.delete({ where: { id } });

  return c.json({ message: "Comment deleted successfully" });
};
