import { Hono } from "hono";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = new Hono();
const apiV1 = new Hono();

apiV1.route("/", authRoutes);
apiV1.route("/posts", postRoutes);
apiV1.route("/comments", commentRoutes);

app.get("/", (c) => {
  return c.text("Hello from big blog!");
});

app.route("/v1", apiV1);

export default {
  port: 3000,
  fetch: app.fetch,
};
