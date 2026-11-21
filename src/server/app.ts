import express, { type ErrorRequestHandler } from "express";
import session from "express-session";
import { join } from "node:path";
import type { Db } from "./db/database";
import { authRouter } from "./routes/auth.routes";

// Factory instead of a module-level app, so tests can pass an in-memory DB and skip listen().
export function createApp(db: Db, sessionSecret: string) {
  const app = express();

  app.use(express.json());
  app.use(
    session({
      name: "sid",
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: "lax", secure: "auto" },
    }),
  );

  app.get("/api/health", (_req, res) => {
    const row = db.prepare("SELECT 1 AS ok").get() as { ok: number };
    res.json({ status: "ok", db: row.ok === 1 });
  });

  app.use("/api", authRouter(db));

  // Unknown API routes get JSON, not the React page.
  // TODO investiage
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Serve the built React app (npm start). Client-side routes fall back to index.html.
  // TODO investigate
  const clientDir = join(import.meta.dirname, "../../dist/client");
  app.use(express.static(clientDir));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(join(clientDir, "index.html"));
  });

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  };
  app.use(errorHandler);

  return app;
}
