import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Listing } from "@prisma/client";
import Link from "next/link";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={`https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?text=${listing.title}`}
          alt={listing.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <CardHeader>
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription>
          {listing.address}, {listing.country}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{listing.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            ${listing.dailyRate.toFixed(2)} / night
          </p>
          <Badge variant={listing.isAvailable ? "success" : "destructive"}>
            {listing.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/listings/${listing.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
