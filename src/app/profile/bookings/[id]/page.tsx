"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "antd";
import { useUser } from "@/context/user";
import { fetchWithToken } from "@/utils/fetchWithToken";
import { DateRangePicker } from "@/components/datePicker";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function UpdateBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const { token } = useUser();
  const [booking, setBooking] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBookingAndListing = async () => {
    if (token) {
      try {
        const bookingData = await fetchWithToken(
          `/api/bookings/${params.id}`,
          token
        );
        setBooking(bookingData);
        if (bookingData && bookingData.listingId) {
          const listingData = await fetchWithToken(
            `/api/listings/${bookingData.listingId}`,
            token
          );
          setListing(listingData);
        } else {
          throw new Error("Booking data or listingId is missing");
        }
      } catch (error: any) {
        console.error("Failed to fetch booking or listing", error);
        setError(error.message || "Failed to load booking data");
        toast({
          title: "Error",
          description: (
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span>Failed to load booking data.</span>
            </div>
          ),
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
    fetchBookingAndListing();
  }, [token, params.id, router]);

  const handleUpdateBooking = async (
    dates: [Date, Date],
    totalPrice: number
  ) => {
    if (!token) {
      console.error("No token available");
      router.push("/login");
      return;
    }

    try {
      await fetchWithToken(`/api/bookings/${params.id}`, token, {
        method: "PUT",
        body: JSON.stringify({
          checkInDate: dates[0].toISOString(),
          checkOutDate: dates[1].toISOString(),
          totalPrice,
        }),
      });

      toast({
        title: "Booking Updated",
        description: (
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            <span>The booking has been successfully updated.</span>
          </div>
        ),
      });
      await fetchBookingAndListing();
    } catch (error: any) {
      console.error("Error during booking update", error);
      toast({
        title: "Update Failed",
        description: (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span>An error occurred while updating the booking.</span>
          </div>
        ),
        variant: "destructive",
      });
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

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!booking || !listing) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-red-500">
          Error: Booking or listing data not available
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-1">
      <Card className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Update Booking</h2>
        <DateRangePicker
          bookedDates={listing.bookedDates || []}
          listingId={listing.id}
          dailyRate={listing.dailyRate}
          actionMode="update"
          bookingId={booking.id}
          initialDates={[
            new Date(booking.checkInDate),
            new Date(booking.checkOutDate),
          ]}
          onConfirm={handleUpdateBooking}
        />
      </Card>
    </div>
  );
}
