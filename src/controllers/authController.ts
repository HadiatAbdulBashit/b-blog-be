import { prisma } from "../config/prismaClient.js";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Context } from "hono";
import { DEFAULT_SECRET_KEY } from "../constant/index.js";

const SECRET_KEY = process.env.JWT_SECRET;

export const register = async (c: Context) => {
  const { name, email, password } = await c.req.json();
  if (!name || !email || !password) return c.json({ error: "All fields are required" }, 400);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return c.json({ error: "User already exists" }, 400);

  const hashedPassword = await hash(password, 8);
  await prisma.user.create({ data: { name, email, password: hashedPassword } });

  return c.json({ message: "User registered successfully" }, 201);
};

export const login = async (c: Context) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await compare(password, user.password))) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const token = sign({ id: user.id }, SECRET_KEY ?? DEFAULT_SECRET_KEY, { expiresIn: "1h" });
  return c.json({ token });
};

export const logout = async (c: Context) => c.json({ message: "Logout successful" });
