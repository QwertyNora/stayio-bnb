"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "antd";
import { useUser } from "@/context/user";
import { fetchWithToken } from "@/utils/fetchWithToken";

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
    router.push("/listings/create");
  };

  const handleUpdateListing = (listingId: string) => {
    router.push(`/profile/listings/${listingId}/update`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Listings</h1>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
              <p className="text-gray-600 mb-2">{listing.description}</p>
              <p className="text-lg font-bold mb-4">
                ${listing.dailyRate} / night
              </p>
              <Button
                onClick={() => handleUpdateListing(listing.id)}
                type="primary"
              >
                Update Listing
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl mb-4">You have no listings.</p>
          <Button onClick={handleCreateListing} type="primary" size="large">
            Create New Listing
          </Button>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button, Card } from "antd";
// import { useUser } from "@/context/user";
// import { fetchWithToken } from "@/utils/fetchWithToken"; // Custom utility

// export default function ProfileListingsPage() {
//   const { token } = useUser();
//   const [listings, setListings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const loadListings = async () => {
//       if (token) {
//         try {
//           const data = await fetchWithToken("/api/users/me/listings", token);
//           setListings(data.listings || []);
//         } catch (error) {
//           console.error("Failed to fetch listings", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         router.push("/login");
//       }
//     };

//     loadListings();
//   }, [token]);

//   const handleCreateListing = () => {
//     router.push("/listings/create"); // Redirect to create listing page
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>My Listings</h1>
//       {listings.length > 0 ? (
//         listings.map((listing) => (
//           <Card key={listing.id}>
//             <p>Title: {listing.title}</p>
//             <p>Description: {listing.description}</p>
//             <p>Daily Rate: ${listing.dailyRate}</p>
//             {/* Amenities could also be displayed here */}
//           </Card>
//         ))
//       ) : (
//         <div>
//           <p>You have no listings.</p>
//           <Button onClick={handleCreateListing}>Create New Listing</Button>
//         </div>
//       )}
//     </div>
//   );
// }
