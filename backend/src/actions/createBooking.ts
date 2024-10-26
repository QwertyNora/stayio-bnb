"use server";
import { getDateRange } from "@/utils/dates";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { revalidateTag } from "next/cache";
// import { BookingData } from "@/types/booking";

const prisma = new PrismaClient();

export default async function createBooking(bookingData: BookingData) {
  console.log("Creating booking with data:", bookingData); // Logga datan som skickas in

  const { listingId, checkInDate, checkOutDate, totalPrice } = bookingData;

  // Skapa en lista med alla datum från checkIn till checkOut
  const dateRange = getDateRange(checkInDate, checkOutDate);

  console.log("Date range generated:", dateRange);

  // Kontrollera om några av datumen i dateRange redan finns i listingens bookedDates
  const listing = await prisma.listing.findFirst({
    where: { id: listingId },
    select: { bookedDates: true }, // Hämta bara bookedDates-fältet
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

  // Uppdatera listingens bookedDates med alla dessa datum (om inga konflikter)
  await prisma.listing.update({
    where: { id: listingId },
    data: {
      bookedDates: {
        push: dateRange, // Lägg till alla nya datum i bookedDates
      },
    },
  });
  console.log("Listing updated with new booked dates:", dateRange);

  // Skapa själva bokningen
  const booking = await prisma.booking.create({
    data: {
      listingId,
      checkInDate,
      checkOutDate,
      totalPrice,
      createdById: bookingData.createdById, // Om du skickar med användar-ID
    },
  });

  console.log("Booking created in database:", booking);

  revalidateTag(`listing:${listingId}`); // Uppdatera cache för listningen

  return booking;
}

// import { PrismaClient } from "@prisma/client";
// import dayjs from "dayjs";

// const prisma = new PrismaClient();

// export default async function createBooking(bookingData: BookingData) {
//   const { listingId, checkInDate, checkOutDate, totalPrice } = bookingData;

//   // Skapa en lista med alla datum från checkIn till checkOut
//   const dateRange = [];
//   let currentDate = dayjs(checkInDate);

//   while (
//     currentDate.isBefore(dayjs(checkOutDate)) ||
//     currentDate.isSame(dayjs(checkOutDate), "day")
//   ) {
//     dateRange.push(currentDate.toDate()); // Lägg till varje datum i arrayen
//     currentDate = currentDate.add(1, "day"); // Öka med en dag
//   }

//   // Uppdatera listingens bookedDates med alla dessa datum
//   await prisma.listing.update({
//     where: { id: listingId },
//     data: {
//       bookedDates: {
//         push: dateRange, // Lägg till alla datum i bookedDates
//       },
//     },
//   });

//   // Skapa själva bokningen
//   const booking = await prisma.booking.create({
//     data: {
//       listingId,
//       checkInDate,
//       checkOutDate,
//       totalPrice,
//       createdById: bookingData.createdById, // Om du skickar med användar-ID
//     },
//   });

//   return booking;
// }

// NY:
// import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/prisma"; // Assuming Prisma client is initialized in /lib/prisma.ts

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { listingId, checkInDate, checkOutDate } = req.body;

//     if (!listingId || !checkInDate || !checkOutDate) {
//       return res.status(400).json({ message: "Missing required fields." });
//     }

//     try {
//       // Add the booked dates to the Listing's bookedDates array
//       await prisma.listing.update({
//         where: { id: listingId },
//         data: {
//           bookedDates: {
//             push: [new Date(checkInDate), new Date(checkOutDate)]
//           }
//         }
//       });

//       // Create a new booking entry in the Booking model
//       const newBooking = await prisma.booking.create({
//         data: {
//           listingId,
//           checkInDate: new Date(checkInDate),
//           checkOutDate: new Date(checkOutDate),
//           totalPrice: calculateTotalPrice(checkInDate, checkOutDate, listingId),
//           createdBy: { connect: { id: req.user.id } }, // Assuming you're handling authentication
//         },
//       });

//       return res.status(201).json(newBooking);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Internal server error." });
//     }
//   } else {
//     return res.status(405).json({ message: "Method not allowed." });
//   }
// }

// // Example function to calculate the total price
// function calculateTotalPrice(checkInDate: string, checkOutDate: string, listingId: string): number {
//   const days = (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24);
//   const listing = prisma.listing.findUnique({ where: { id: listingId } });
//   return listing?.dailyRate ? listing.dailyRate * days : 0;
// }
