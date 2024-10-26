"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchWithToken } from "@/utils/fetchWithToken";
import { Listing, Booking } from "@prisma/client";

export default function AdminPage() {
  const { user, token } = useUser();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    console.log(user);
    if (user && !user.isAdmin) {
      router.push("/");
      return;
    }

    if (token && user && user.isAdmin) {
      fetchListings();
      fetchBookings();
    }
  }, [user, router, token]);

  const fetchListings = async () => {
    if (!token) return;
    try {
      const data = await fetchWithToken("/api/admin/listings", token);
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const fetchBookings = async () => {
    if (!token) return;
    try {
      const data = await fetchWithToken("/api/admin/bookings", token);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!token) return;
    try {
      await fetchWithToken(`/api/admin/listings/${id}`, token, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setListings(listings.filter((listing) => listing.id !== id));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!token) return;
    try {
      await fetchWithToken(`/api/admin/bookings/${id}`, token, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">All Listings</TabsTrigger>
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="listings">
          {listings.map((listing) => (
            <Card key={listing.id} className="mb-4">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{listing.title}</h2>
                <p>{listing.description}</p>
                <p>
                  Address: {listing.address}, {listing.country}
                </p>
                <p>Daily Rate: ${listing.dailyRate}</p>
                <Button
                  // variant="destructive"
                  onClick={() => handleDeleteListing(listing.id)}
                  className="mt-2"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="bookings">
          {bookings.map((booking) => (
            <Card key={booking.id} className="mb-4">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">
                  Booking ID: {booking.id}
                </h2>
                <p>
                  Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                </p>
                <p>
                  Check-out:{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
                <p>Total Price: ${booking.totalPrice}</p>
                <Button
                  // variant="destructive"
                  onClick={() => handleDeleteBooking(booking.id)}
                  className="mt-2"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
