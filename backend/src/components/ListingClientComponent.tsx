"use client";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { DateRangePicker } from "@/components/datePicker";
import { useEffect, useState } from "react";
import { message } from "antd";

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
    try {
      const response = await fetch(`/api/listings/${listingId}`);
      if (response.ok) {
        const updatedListing = await response.json();
        if (updatedListing && updatedListing.bookedDates) {
          setBookedDates(
            updatedListing.bookedDates.map((date: string) => new Date(date))
          );
        }
      } else {
        throw new Error("Failed to fetch updated listing data");
      }
    } catch (error) {
      console.error("Error refreshing listing data:", error);
      message.error("Failed to refresh listing data");
    }
  };

  useEffect(() => {
    refreshListingData();
  }, [listingId]);

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
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: listingId,
          checkInDate: dates[0],
          checkOutDate: dates[1],
          totalPrice,
          createdById: user?.id,
        }),
      });

      if (response.ok) {
        await refreshListingData();
        message.success("Booking successful");
        router.push("/profile");
      } else {
        throw new Error("Booking failed");
      }
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
