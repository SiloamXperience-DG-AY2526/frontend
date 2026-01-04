import { LoginInputData, UserCredentials } from "@/types/AuthData";

// client-side auth functions
export async function login(
  loginData: LoginInputData
): Promise<UserCredentials> {
  const res = await fetch("/api/auth/login", {
    // auth token set
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (!res.ok) throw await res.json().catch(() => ({}));

  const userInfo = await getUserCredentials();

  return userInfo;
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function getUserCredentials(): Promise<UserCredentials> {
  const res = await fetch("/api/auth/user");
  const { userId, roles } = await res.json();

  return { userId, roles };
}
