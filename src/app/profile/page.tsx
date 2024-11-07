"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Card } from "antd";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { fetchWithToken } from "@/utils/fetchWithToken";
import { Spinner } from "@/components/ui/spinner";

export default function ProfilePage() {
  const { user, token } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("@library/token");
      if (token) {
        try {
          const response = await fetch("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Unauthorized");
          }
        } catch (error) {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      if (token) {
        try {
          const data = await fetchWithToken("/api/users/me", token);
          setBookings(data.bookings || []);
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
    router.push(`/bookings/update/${bookingId}`);
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
      </motion.div>
    </div>
  );
}
