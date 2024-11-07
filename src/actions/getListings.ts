"server only";

import { Listing } from "@prisma/client";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function getListings(queries: any): Promise<Listing[]> {
  const url = new URL(`${BASE_URL}/api/listings`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to get listings");
    }
    const listings: Listing[] = await response.json();
    return listings;
  } catch (error: any) {
    console.warn("Error fetching listing (action)", error.message);
    return [];
  }
}
