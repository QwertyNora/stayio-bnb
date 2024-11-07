"use server";
import { getDateRange } from "@/utils/dates";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { revalidateTag } from "next/cache";

const prisma = new PrismaClient();

export default async function createBooking(bookingData: BookingData) {
  console.log("Creating booking with data:", bookingData);

  const { listingId, checkInDate, checkOutDate, totalPrice } = bookingData;

  const dateRange = getDateRange(checkInDate, checkOutDate);

  console.log("Date range generated:", dateRange);

  const listing = await prisma.listing.findFirst({
    where: { id: listingId },
    select: { bookedDates: true },
  });

  if (!listing) {
    console.log("Listing not found for id:", listingId);
    throw new Error(`Listing not found for id ${listingId}`);
  }

  const existingDates = listing.bookedDates || [];
  const conflictingDates = dateRange.filter((date) =>
    existingDates.some((bookedDate) => dayjs(bookedDate).isSame(date, "day"))
  );

  if (conflictingDates.length > 0) {
    console.log("Conflicting dates found:", conflictingDates);
    throw new Error("Some of the selected dates are already booked.");
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      bookedDates: {
        push: dateRange,
      },
    },
  });
  console.log("Listing updated with new booked dates:", dateRange);

  const booking = await prisma.booking.create({
    data: {
      listingId,
      checkInDate,
      checkOutDate,
      totalPrice,
      createdById: bookingData.createdById,
    },
  });

  console.log("Booking created in database:", booking);

  revalidateTag(`listing:${listingId}`); // Uppdatera cache för listningen

  return booking;
}
