"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:3000";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(`${backendUrl}/api/listings`);
      setListings(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="">
      <h1>Listings</h1>
      <div>
        {listings.map((listing) => (
          <div key={listing.id}>
            <h2>{listing.title}</h2>
            <p>Price: ${listing.dailyRate}</p>
            <p>{listing.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
