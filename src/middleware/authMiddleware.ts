import { Context } from "hono";
import { verify } from "jsonwebtoken";
import { DEFAULT_SECRET_KEY } from "../constant";

const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  try {
    const decoded = verify(token, process.env.JWT_SECRET ?? DEFAULT_SECRET_KEY);
    c.set("user", decoded);
    await next();
  } catch {
    return c.json({ error: "Invalid Token" }, 403);
  }
};

export default authMiddleware;
