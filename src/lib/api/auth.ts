import { LoginData } from "@/types/auth";

// client-side auth API function calls
export async function login(loginData: LoginData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (!res.ok) throw await res.json().catch(() => ({}));
  return res.json();
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}
