"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user";
import { fetchWithToken } from "@/utils/fetchWithToken";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Booking {
  id: string;
  listingId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
}

export default function ProfileBookingsPage() {
  const { token } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const router = useRouter();

  const loadBookings = async () => {
    if (token) {
      try {
        setLoading(true);
        const data = await fetchWithToken("/api/users/me/bookings", token);
        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
        toast({
          title: "Error",
          description: "Failed to fetch bookings. Please try again.",
          variant: "destructive",
        });
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
    const handleFocus = () => {
      loadBookings();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleUpdateBooking = (bookingId: string) => {
    router.push(`/profile/bookings/${bookingId}`);
  };

  const handleDeleteConfirmation = (bookingId: string) => {
    setBookingToDelete(bookingId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete || !token) return;

    try {
      await fetchWithToken(`/api/users/me/bookings/${bookingToDelete}`, token, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBookings(bookings.filter((booking) => booking.id !== bookingToDelete));
      toast({
        title: "Booking Deleted",
        description: (
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            <span>The booking has been successfully deleted.</span>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Deletion Failed",
        description: (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span>
              There was an error deleting the booking. Please try again.
            </span>
          </div>
        ),
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setBookingToDelete(null);
    }
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
                  <div className="flex justify-between mt-4">
                    <Button
                      onClick={() => handleUpdateBooking(booking.id)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Update booking
                    </Button>
                    <Button
                      onClick={() => handleDeleteConfirmation(booking.id)}
                      variant="destructive"
                    >
                      Delete booking
                    </Button>
                  </div>
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

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action is
              irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBooking}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
