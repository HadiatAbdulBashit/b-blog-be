import { prisma } from "../config/prismaClient.js";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Context } from "hono";

const SECRET_KEY = process.env.JWT_SECRET;
const DEFAULT_SECRET_KEY = "THIS_IS_A_DEFAULT_SECRET_KEY";

export const register = async (c: Context) => {
  const { name, email, password } = await c.req.json();
  if (!name || !email || !password) return c.json({ error: "All fields are required" }, 400);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return c.json({ error: "User already exists" }, 400);

  const hashedPassword = await hash(password, 8);
  const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

  return c.json({ message: "User registered successfully" }, 201);
};

export const login = async (c: Context) => {
  const { email, password } = await c.req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await compare(password, user.password))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = sign({ id: user.id, email: user.email }, SECRET_KEY ?? DEFAULT_SECRET_KEY, { expiresIn: "1h" });
  return c.json({ token });
};

export const logout = async (c: Context) => c.json({ message: "Logout successful" });
