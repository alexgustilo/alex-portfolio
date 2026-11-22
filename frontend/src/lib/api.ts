const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const ACCESS_TOKEN_KEY = "alex_portfolio_access_token";
const REFRESH_TOKEN_KEY = "alex_portfolio_refresh_token";


export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status: number, detail: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}


export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}


export function getRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}


export function saveAuthSession(session: {
  access_token: string;
  refresh_token: string;
}): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, session.access_token);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
}


export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}


export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  // Detect file uploads so the browser can set the multipart boundary.
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  // JSON requests need an explicit content type.
  // FormData requests must let the browser set it automatically.
  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Unable to connect to the backend API. Check whether FastAPI is running.",
    );
  }

  let data: unknown = null;

  if (response.status !== 204) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" && data !== null && "detail" in data
        ? (data as { detail: unknown }).detail
        : data;

    const message =
      typeof detail === "string"
        ? detail
        : `API request failed with status ${response.status}.`;

    throw new ApiError(message, response.status, detail);
  }

  return data as T;
}
