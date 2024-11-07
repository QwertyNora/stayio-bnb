import { Booking } from "@prisma/client";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function getBookingById(id: string): Promise<Booking | null> {
  const url = new URL(`${BASE_URL}/api/bookings/${id}`);

  try {
    const response = await fetch(url, {
      next: {
        tags: [`booking:${id}`],
      },
    });

    if (!response.ok) {
      throw new Error("Unable to get booking");
    }

    const booking: Booking = await response.json();
    return booking;
  } catch (error: any) {
    console.warn("Error fetching booking by ID (action)", error.message);
    return null;
  }
}
