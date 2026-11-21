import { get, post } from "../backendRaw";
import { type AuthUser } from "../../../shared/authTypes";
import type { LoginInput, RegisterInput } from "../../../shared/authSchemas";

export type { LoginInput, RegisterInput };

interface UserResponse {
  user: AuthUser;
}

// GET /api/me. Rejects with a 401 ApiError when nobody is signed in.
export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await get<UserResponse>("/me");
  return response.user;
}

export async function loginRequest(input: LoginInput): Promise<AuthUser> {
  const response = await post<UserResponse>("/login", input);
  return response.user;
}

export async function registerRequest(input: RegisterInput): Promise<AuthUser> {
  const response = await post<UserResponse>("/register", input);
  return response.user;
}

export async function logoutRequest(): Promise<void> {
  await post<null>("/logout");
}
