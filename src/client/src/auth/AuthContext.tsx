import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "../backendRaw";
import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
  type LoginInput,
  type RegisterInput,
} from "../api/auth";
import { type AuthUser } from "../../../shared/authTypes";

type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Holds who is signed in. On start it asks the server (GET /api/me); a 401, or
// any other failure, simply means "nobody is signed in".
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser()
      .then((currentUser) => {
        if (!cancelled) {
          setUser(currentUser);
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setStatus("anonymous");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const signedInUser = await loginRequest(input);
    setUser(signedInUser);
    setStatus("authenticated");
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const newUser = await registerRequest(input);
    setUser(newUser);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // A 401 means the session is already gone, which is what we wanted.
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error;
      }
    }
    setUser(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(() => {
    return { status, user, login, register, logout };
  }, [status, user, login, register, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return value;
}
