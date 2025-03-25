import { prisma } from "../config/prismaClient.js";
import { Context } from "hono";

export const getAllPosts = async (c: Context) => {
  try {
    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    const skip = (page - 1) * limit;
    const search = c.req.query("q") || "";
    const sort = c.req.query("sort") === "asc" ? "asc" : "desc";
    const sortBy = c.req.query("sortBy") || "createdAt";

    const allowedSortFields = ["title", "createdAt"];
    if (!allowedSortFields.includes(sortBy)) {
      return c.json({ error: "Invalid sortBy field" }, 400);
    }

    const [posts, totalPosts] = await prisma.$transaction([
      prisma.post.findMany({
        where: {
          OR: [{ title: { contains: search } }, { content: { contains: search } }],
        },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sort,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
      prisma.post.count({
        where: {
          OR: [{ title: { contains: search } }, { content: { contains: search } }],
        },
      }),
    ]);

    return c.json({
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
};

export const getAllMyPosts = async (c: Context) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    where: { authorId: c.get("user").id },
  });

  return c.json(posts);
};

export const getPostById = async (c: Context) => {
  const { id } = c.req.param();

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { omit: { password: true } } },
  });

  return post ? c.json(post) : c.json({ error: "Post not found" }, 404);
};

export const createPost = async (c: Context) => {
  const { title, content } = await c.req.json();
  const user = c.get("user");

  if (!title || !content) return c.json({ error: "Title and content are required" }, 400);

  const post = await prisma.post.create({ data: { title, content, authorId: user.id } });
  return c.json(post, 201);
};

export const updatePost = async (c: Context) => {
  const { id } = c.req.param();
  const { title, content } = await c.req.json();
  const user = c.get("user");

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return c.json({ error: "Post not found" }, 404);
  if (post.authorId !== user.id) return c.json({ error: "Unauthorized access" }, 403);

  const updatedPost = await prisma.post.update({ where: { id }, data: { title, content } });
  return c.json(updatedPost);
};

export const deletePost = async (c: Context) => {
  const { id } = c.req.param();
  const user = c.get("user");

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return c.json({ error: "Post not found" }, 404);
  if (post.authorId !== user.id) return c.json({ error: "Unauthorized access" }, 403);

  await prisma.post.delete({ where: { id } });
  return c.json({ message: "Post deleted successfully" });
};
