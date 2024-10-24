import { Listing } from "@prisma/client";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function getListingById(
  id: string,
  token?: string
): Promise<Listing | null> {
  const url = new URL(`${BASE_URL}/api/listings/${id}`);

  try {
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      next: {
        tags: [`listing:${id}`],
      },
    });

    if (!response.ok) {
      throw new Error("Unable to get listing");
    }

    const listing: Listing = await response.json();
    return listing;
  } catch (error: any) {
    console.warn("Error fetching listing by ID (action)", error.message);
    return null;
  }
}

// import { Listing } from "@prisma/client";

// const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// export async function getListingById(id: string): Promise<Listing | null> {
//   const url = new URL(`${BASE_URL}/api/listings/${id}`);

//   try {
//     const response = await fetch(url, {
//       next: {
//         tags: [`listing:${id}`],
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Unable to get listing");
//     }

//     const listing: Listing = await response.json();
//     return listing;
//   } catch (error: any) {
//     console.warn("Error fetching listing by ID (action)", error.message);
//     return null;
//   }
// }
