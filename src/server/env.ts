import "dotenv/config";
console.log("DEBUG SECRET:", process.env.SESSION_SECRET);
console.log("CWD:", process.cwd());
console.log("SESSION_SECRET length:", process.env.SESSION_SECRET?.length);

const MIN_SESSION_SECRET_LENGTH = 32;

function readSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret === undefined || secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new Error(
      `SESSION_SECRET must be set and at least ${MIN_SESSION_SECRET_LENGTH} characters`,
    );
  }
  return secret;
}

function readPort(): number {
  const raw = process.env.PORT ?? "3000";
  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`PORT must be a positive integer, got "${raw}"`);
  }
  return port;
}

// Validated once at startup
export const env = {
  SESSION_SECRET: readSessionSecret(),
  PORT: readPort(),
  DB_PATH: process.env.DB_PATH ?? "./data/app.db",
};
