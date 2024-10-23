"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "antd";
import { useUser } from "@/context/user";
import { fetchWithToken } from "@/utils/fetchWithToken"; // Custom utility

export default function ProfileListingsPage() {
  const { token } = useUser();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadListings = async () => {
      if (token) {
        try {
          const data = await fetchWithToken("/api/users/me/listings", token);
          setListings(data.listings || []);
        } catch (error) {
          console.error("Failed to fetch listings", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    };

    loadListings();
  }, [token]);

  const handleCreateListing = () => {
    router.push("/listings/create"); // Redirect to create listing page
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Listings</h1>
      {listings.length > 0 ? (
        listings.map((listing) => (
          <Card key={listing.id}>
            <p>Title: {listing.title}</p>
            <p>Description: {listing.description}</p>
            <p>Daily Rate: ${listing.dailyRate}</p>
            {/* Amenities could also be displayed here */}
          </Card>
        ))
      ) : (
        <div>
          <p>You have no listings.</p>
          <Button onClick={handleCreateListing}>Create New Listing</Button>
        </div>
      )}
    </div>
  );
}
