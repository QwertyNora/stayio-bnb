"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "antd";
import { useUser } from "@/context/user";
import { fetchWithToken } from "@/utils/fetchWithToken";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

export default function ProfileBookingsPage() {
  const { token } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadBookings = async () => {
    if (token) {
      try {
        setLoading(true);
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

  useEffect(() => {
    loadBookings();
  }, [token]);

  useEffect(() => {
    // Refresh data when the page comes into focus
    const handleFocus = () => {
      loadBookings();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleUpdateBooking = (bookingId: string) => {
    router.push(`/profile/bookings/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <Spinner className="text-grey-100">
          <span className="text-grey-200">Loading ...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-1">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl px-6"
      >
        <Card className="p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {bookings.length > 0
              ? "Your bookings:"
              : "You don't have any bookings"}
          </h2>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gray-50 rounded-lg border"
                >
                  <p className="text-lg">
                    Booking at listing ID: <strong>{booking.listingId}</strong>
                  </p>
                  <p>
                    Check-in:{" "}
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                  <p>
                    Check-out:{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                  <p>Total price: ${booking.totalPrice.toFixed(2)}</p>
                  <Button
                    type="primary"
                    className="mt-4"
                    onClick={() => handleUpdateBooking(booking.id)}
                  >
                    Update booking
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              You currently have no bookings. Start booking today!
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
