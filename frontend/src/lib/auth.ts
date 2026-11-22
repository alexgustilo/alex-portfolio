import {
  apiRequest,
  clearAuthSession,
  getRefreshToken,
  saveAuthSession,
} from "@/lib/api";


export interface AdminUser {
  id: string;
  email: string | null;
  app_metadata: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}


export interface AuthSession {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number | null;
  user: AdminUser;
}


export async function loginAdmin(
  email: string,
  password: string,
): Promise<AuthSession> {
  const session = await apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  saveAuthSession(session);

  return session;
}


export async function refreshAdminSession(): Promise<AuthSession> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token found.");
  }

  const session = await apiRequest<AuthSession>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  saveAuthSession(session);

  return session;
}


export async function getCurrentAdmin(): Promise<AdminUser> {
  return apiRequest<AdminUser>("/auth/me");
}


export async function logoutAdmin(): Promise<void> {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    clearAuthSession();
  }
}
