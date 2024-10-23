"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Card } from "antd";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { fetchWithToken } from "@/utils/fetchWithToken"; // Importera helper-funktionen

export default function ProfilePage() {
  const { user, token } = useUser(); // Hämta token från user-context
  const [bookings, setBookings] = useState<any[]>([]); // State för bokningar
  const [loading, setLoading] = useState(true); // Laddningsindikator
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("@library/token"); // Hämta token från localStorage
      if (token) {
        try {
          // Gör en explicit begäran till servern och inkludera token
          const response = await fetch("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`, // Inkludera JWT-tokenen i Authorization-headern
            },
          });

          if (!response.ok) {
            throw new Error("Unauthorized");
          }

          // Om framgång, fortsätt ladda profilen
        } catch (error) {
          router.push("/login"); // Omdirigera vid fel
        }
      } else {
        router.push("/login"); // Omdirigera om ingen token finns
      }
    };

    loadProfile();
  }, []);

  // Hämta bokningar när token finns
  useEffect(() => {
    const loadBookings = async () => {
      if (token) {
        try {
          const data = await fetchWithToken("/api/users/me", token); // Hämta användardata inkl. bokningar
          setBookings(data.bookings || []); // Uppdatera bokningsstate
        } catch (error) {
          console.error("Failed to fetch bookings", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadBookings();
  }, [token]);

  const handleUpdateBooking = (bookingId: string) => {
    router.push(`/bookings/update/${bookingId}`); // Redirect till en uppdateringssida för bokningen
  };

  if (loading) {
    return <p>Loading...</p>; // Visa laddningsmeddelande medan bokningar hämtas
  }

  const hasBookings = bookings.length > 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-1">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl px-6"
      >
        {/* Profil-header */}
        <h1 className="text-4xl font-bold text-center mb-8 mt-8">
          Hello, {user?.userName}!
        </h1>

        {/* Kort med user-info */}
        <Card className="p-8 bg-white shadow-lg rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-4">User information:</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gray-50 rounded-lg border"
          >
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Username:</strong> {user?.userName}
            </p>
          </motion.div>
        </Card>

        {/* Profil-kort med bokningsinformation */}
        <Card className="p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {hasBookings ? "Your bookings:" : "You don't have any bookings"}
          </h2>

          {hasBookings ? (
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
