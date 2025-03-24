import { Hono } from "hono";
import authRoutes from "./routes/authRoutes";

const app = new Hono();
const apiV1 = new Hono();

apiV1.route("/", authRoutes);

app.get("/", (c) => {
  return c.text("Hello from big blog!");
});

app.route("/v1", apiV1);

export default {
  port: 3000,
  fetch: app.fetch,
};
