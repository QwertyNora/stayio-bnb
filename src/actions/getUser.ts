"use server";

import { SafeUser } from "@/types/user";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function getUser(token: string): Promise<SafeUser | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/users/me/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Error fetching user: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getUser:", error);
    return null;
  }
}
