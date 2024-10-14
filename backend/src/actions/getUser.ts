"use server";

import { SafeUser } from "@/types/user";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function getUser(token: string): Promise<SafeUser> {
  const response = await fetch(`${BASE_URL}/api/users/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    // throw new Error(data)
  }
  const data = await response.json();
  return data;
}
