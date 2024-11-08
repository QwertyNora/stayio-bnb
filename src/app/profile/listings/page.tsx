"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user";
import { fetchWithToken } from "@/utils/fetchWithToken";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, MapPin, DollarSign } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface Listing {
  id: string;
  title: string;
  description: string;
  dailyRate: number;
  address: string;
  country: string;
}

export default function ProfileListingsPage() {
  const { token } = useUser();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadListings = async () => {
      if (token) {
        try {
          const data = await fetchWithToken("/api/users/me/listings", token);
          setListings(data.listings || []);
        } catch (error) {
          console.error("Failed to fetch listings", error);
          toast({
            title: "Error",
            description: "Failed to fetch listings. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    };

    loadListings();
  }, [token, router]);

  const handleCreateListing = () => {
    router.push("/listings/create");
  };

  const handleUpdateListing = (listingId: string) => {
    router.push(`/profile/listings/${listingId}/update`);
  };

  const handleDeleteConfirmation = (listingId: string) => {
    setListingToDelete(listingId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete || !token) return;

    try {
      await fetchWithToken(`/api/users/me/listings/${listingToDelete}`, token, {
        method: "DELETE",
      });
      setListings(listings.filter((listing) => listing.id !== listingToDelete));
      toast({
        title: "Listing Deleted",
        description: (
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            <span>The listing has been successfully deleted.</span>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Deletion Failed",
        description: (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span>
              There was an error deleting the listing. Please try again.
            </span>
          </div>
        ),
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setListingToDelete(null);
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
    <div className="container mx-auto my-28  px-4 py-8">
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary line-clamp-1">
                  {listing.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="flex-grow">
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {listing.description}
                  </p>
                </div>
                <div className="mt-auto">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold">
                      ${listing.dailyRate} / night
                    </span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <p className="text-sm">
                      {listing.address}, {listing.country}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-4">
                <Button
                  onClick={() => handleUpdateListing(listing.id)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Update
                </Button>
                <Button
                  onClick={() => handleDeleteConfirmation(listing.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          <div>
            <Button className="my-7" onClick={handleCreateListing} size="lg">
              Create New Listing
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl mb-4">You have no listings.</p>
          <Button onClick={handleCreateListing} size="lg">
            Create New Listing
          </Button>
        </div>
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action is
              irreversible and will also delete all related bookings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteListing}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
