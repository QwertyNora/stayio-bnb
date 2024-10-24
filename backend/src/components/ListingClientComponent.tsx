"use client";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { DateRangePicker } from "@/components/datePicker";
import { useEffect, useState } from "react";
import { message } from "antd";
import { fetchWithToken } from "@/utils/fetchWithToken";

interface ClientProps {
  listingId: string;
  bookedDates: Date[];
  dailyRate: number;
}

export default function ListingClientComponent({
  listingId,
  bookedDates: initialBookedDates,
  dailyRate,
}: ClientProps) {
  const { token, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState(initialBookedDates);

  const refreshListingData = async () => {
    if (!token) {
      console.error("No token available");
      return;
    }

    try {
      const updatedListing = await fetchWithToken(
        `/api/listings/${listingId}`,
        token
      );
      if (updatedListing && updatedListing.bookedDates) {
        setBookedDates(
          updatedListing.bookedDates.map((date: string) => new Date(date))
        );
      }
    } catch (error) {
      console.error("Error refreshing listing data:", error);
      message.error("Failed to refresh listing data");
    }
  };

  useEffect(() => {
    if (token) {
      refreshListingData();
    }
  }, [listingId, token]);

  const handleSubmitBooking = async (
    dates: [Date, Date],
    totalPrice: number
  ) => {
    if (!token) {
      message.error("You must be logged in to make a booking");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetchWithToken("/api/bookings", token, {
        method: "POST",
        body: JSON.stringify({
          listingId: listingId,
          checkInDate: dates[0],
          checkOutDate: dates[1],
          totalPrice,
          createdById: user?.id,
        }),
      });

      await refreshListingData();
      message.success("Booking successful");
      router.push("/profile");
    } catch (error) {
      console.error("Error during booking", error);
      message.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Book your stay</h1>
      <DateRangePicker
        bookedDates={bookedDates}
        listingId={listingId}
        dailyRate={dailyRate}
        onConfirm={handleSubmitBooking}
        actionMode="create"
      />
      {loading && <p>Loading...</p>}
    </div>
  );
}
