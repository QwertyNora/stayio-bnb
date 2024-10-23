"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "antd";
import { useUser } from "@/context/user";
import { fetchWithToken } from "@/utils/fetchWithToken"; // Custom utility

export default function ProfileBookingsPage() {
  const { token } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadBookings = async () => {
      if (token) {
        try {
          const data = await fetchWithToken("/api/users/me/bookings", token);
          setBookings(data.bookings || []);
        } catch (error) {
          console.error("Failed to fetch bookings", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    };

    loadBookings();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <Card key={booking.id}>
            <p>Listing: {booking.listing.title}</p>
            <p>
              Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
            </p>
            <p>
              Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
            </p>
          </Card>
        ))
      ) : (
        <p>You have no bookings.</p>
      )}
    </div>
  );
}
