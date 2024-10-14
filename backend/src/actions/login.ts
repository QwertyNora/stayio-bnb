"use server";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }
  const data = await response.json();
  return data.token;
}
