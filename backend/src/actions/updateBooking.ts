"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function updateBooking(
  bookingId: string,
  bookingData: {
    checkInDate: Date;
    checkOutDate: Date;
    totalPrice: number;
  }
) {
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        totalPrice: bookingData.totalPrice,
      },
    });

    console.log("Booking updated successfully:", updatedBooking);
    return updatedBooking;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw new Error("Failed to update booking");
  }
}
