import { Router } from "express";
import { loginSchema, registerSchema } from "../../shared/authSchemas";
import { requireAuth } from "../middleware/requireAuth";
import { parseBody } from "../validation/parseBody";
import bcrypt from "bcrypt";
import type { Db } from "../db/database";
import { addUser, findUserByEmail, findUserById, findUserByUsername } from "../repositories/userRepository";

const BCRYPT_ROUNDS = 10; // for password hash with bcrypt

// this type is sent by route to client
interface AuthClientUser {
  id: number;
  email: string;
  userName: string;
}

function toAuthClientUser(user: AuthClientUser): AuthClientUser {
  return {
    id: user.id,
    email: user.email,
    userName: user.userName,
  };
}

// Auth endpoints. A user is always sent to the client as { user: { id, email, userName } }.
export function authRouter(db: Db): Router {
  const router = Router(); // Express Router (instance)

  // 1. Register user (POST /register)
  // hash pw with bcrypt (cost >= 10), validate unique email and username (409),
  // insert user into db, regenerate session and reply with 201
  router.post("/register", async (req, res) => {
    // parseBody takes 'any' (request) and returns the requested schema
    const result = parseBody(registerSchema, req.body);
    if (!result.ok) {
      // if parsing failed, result.fields contains error messages
      res.status(400).json({ error: "Invalid input", fields: result.fields });
      return;
    }

    const { userName, email, password } = result.value;
    
    // Next we check if email and username don't already exist
    const existingByEmail = findUserByEmail(db, email);
    if (existingByEmail) {
      res.status(409).json({ error: "Oops! Email is already in use." });
      return;
    }

    const existingByUsername = findUserByUsername(db, userName);
    if (existingByUsername) {
      res.status(409).json({ error: "Oops! Username is already in use." });
      return;
    }

    // Password hash
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    // Next: try-catch against race conditions where two concurrent requests pass the
    // uniqueness checks above and hit the database UNIQUE constraint at once.
    // So double check if the email or username already exists 
    let createdUserId: number;
    try {
      createdUserId = addUser(db, {
        username: userName,
        email,
        password_hash: passwordHash,
      });
    } catch (err) {
      // next we get the error code, but first we check for the type and .code attribute
      const code =
        typeof err === "object" && err !== null && "code" in err // checks if err is a real object and has .code attribute
          ? String((err as { code?: unknown }).code)
          : ""; // returns error or empty string

      if (code.startsWith("SQLITE_CONSTRAINT")) {
        res.status(409).json({ error: "Oops! Email or username is already in use." });
        return;
      }

      throw err;
    }

    // Success! Email and nickname don't exist, password hash is made, user created
    req.session.regenerate((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to create session." });
        return;
      }

      req.session.userId = createdUserId;
      res.status(201).json({
        user: toAuthClientUser({ id: createdUserId, email, userName }),
      });
    });
  });

  // 2. Login (POST /login)
  // Looks the user up by email with a parameterized query and compare with bcrypt.
  // An unknown email and a wrong password must give the same 401 { error: "Wrong email or password." }.
  // On success regenerate the session, store the userId, answer 200.
  router.post("/login", async (req, res) => {
    // parseBody (again...) takes 'any' (request) and returns the requested schema
    const result = parseBody(loginSchema, req.body);
    if (!result.ok) {
      // if parsing failed, result.fields contains error messages
      res.status(400).json({ error: "Invalid input", fields: result.fields });
      return;
    }

    const { email, password } = result.value;
    
    // Next, we look for the User with email...
    const user = findUserByEmail(db, email);
    if (!user) {
      res.status(401).json({ error: "Wrong email or password." });
      return;
    }

    // ...and check if the password is correct
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      res.status(401).json({ error: "Wrong email or password." });
      return;
    }

    // Success! Email and password are OK
    req.session.regenerate((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to start session." });
        return;
      }

      req.session.userId = user.user_id;
      res.status(200).json({
        user: toAuthClientUser({
          id: user.user_id,
          email: user.email,
          userName: user.username,
        }),
      });
    });
  });

  // 3. Logout (POST /logout)
  // Destroys the session, clears the "sid" cookie, answers 204.
  // Error if not logged in
  router.post("/logout", requireAuth, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to destroy session." });
        return;
      }

      res.clearCookie("sid");
      res.status(204).end();
    });
  });

  // 4. Current User page (GET /me)
  // Loads the user for req.session.userId and answer 200 { user }.
  // If that user no longer exists or none is logged in,
  // destroy the session and answer 401.
  router.get("/me", requireAuth, (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.status(401).json({ error: "Not signed in :(" });
      return;
    }

    const user = findUserById(db, userId);
    if (!user) {
      req.session.destroy(() => {
        res.clearCookie("sid");
        res.status(401).json({ error: "Not signed in :(" });
      });
      return;
    }

    res.status(200).json({
      user: toAuthClientUser({
        id: user.user_id,
        email: user.email,
        userName: user.username,
      }),
    });
  });

  return router;
}