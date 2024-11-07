"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchWithToken } from "@/utils/fetchWithToken";
import { Listing, Booking } from "@prisma/client";
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

export default function AdminPage() {
  const { user, token } = useUser();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "listing" | "booking";
  } | null>(null);

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

  const handleDeleteConfirmation = (
    id: string,
    type: "listing" | "booking"
  ) => {
    setItemToDelete({ id, type });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete || !token) return;

    try {
      if (itemToDelete.type === "listing") {
        await fetchWithToken(`/api/admin/listings/${itemToDelete.id}`, token, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setListings(
          listings.filter((listing) => listing.id !== itemToDelete.id)
        );
      } else {
        await fetchWithToken(`/api/admin/bookings/${itemToDelete.id}`, token, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setBookings(
          bookings.filter((booking) => booking.id !== itemToDelete.id)
        );
      }

      toast({
        title: "Deletion Successful",
        description: (
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            <span>The {itemToDelete.type} has been deleted.</span>
          </div>
        ),
      });
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
      toast({
        title: "Deletion Failed",
        description: (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span>
              There was an error deleting the {itemToDelete.type}. Please try
              again.
            </span>
          </div>
        ),
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listings">All Listings</TabsTrigger>
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="listings" className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-primary mb-2">
                      {listing.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {listing.description}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Address:</span>{" "}
                      {listing.address}, {listing.country}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Daily Rate:</span> $
                      {listing.dailyRate}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleDeleteConfirmation(listing.id, "listing")
                    }
                    className="ml-4"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="bookings" className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-primary mb-2">
                      Booking ID: {booking.id}
                    </h2>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Check-in:</span>{" "}
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Check-out:</span>{" "}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Total Price:</span> $
                      {booking.totalPrice}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleDeleteConfirmation(booking.id, "booking")
                    }
                    className="ml-4"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This
              action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
