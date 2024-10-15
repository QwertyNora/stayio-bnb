"use server";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function login(
  emailOrUserName: string,
  password: string
): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      emailOrUserName,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Login failed";
    throw new Error(errorMessage);
  }
  const data = await response.json();
  return data.token;
}
