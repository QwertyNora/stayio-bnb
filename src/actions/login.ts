"use server";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function login(
  emailOrUserName: string,
  password: string
): Promise<{ token: string | null; error: string | null }> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailOrUserName,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login error:", errorData);
      return { token: null, error: errorData.message || "Login failed" };
    }

    const data = await response.json();
    if (!data.token) {
      console.error("No token received from server");
      return { token: null, error: "No token received from server" };
    }

    return { token: data.token, error: null };
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return { token: null, error: "An unexpected error occurred" };
  }
}
