"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user";
import { fetchWithToken } from "@/utils/fetchWithToken";
import { motion } from "framer-motion";
import { Upload } from "antd";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Home,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function UpdateListingPage({
  params,
}: {
  params: { id: string };
}) {
  const { token } = useUser();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [newImages, setNewImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchListing = async () => {
      if (token) {
        try {
          const data = await fetchWithToken(
            `/api/listings/${params.id}`,
            token
          );
          setListing(data);
        } catch (error) {
          console.error("Failed to fetch listing", error);
          toast({
            title: "Error",
            description: "Failed to load listing data",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    };

    fetchListing();
  }, [token, params.id, router]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setNewImages((prev) => [...prev, base64]);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleExistingImageRemove = (url: string) => {
    setRemovedImages((prev) => [...prev, url]);
    setListing((prev: any) => ({
      ...prev,
      images: prev.images.filter((image: string) => image !== url),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);

    if (token) {
      try {
        await fetchWithToken(`/api/listings/${params.id}`, token, {
          method: "PUT",
          body: JSON.stringify({
            title: formData.get("title"),
            description: formData.get("description"),
            address: formData.get("address"),
            country: formData.get("country"),
            dailyRate: parseFloat(formData.get("dailyRate") as string),
            newImages,
            removedImages,
          }),
        });
        toast({
          title: "Success",
          description: "Listing updated successfully",
        });
        router.push("/profile/listings");
      } catch (error) {
        console.error("Failed to update listing", error);
        toast({
          title: "Error",
          description: "Failed to update listing",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (!listing) return <p>Listing not found</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Update Listing</CardTitle>
          <CardDescription>Update the details of your listing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={listing.title}
                required
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={listing.description}
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-lg">
                  Address
                </Label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="address"
                    name="address"
                    defaultValue={listing.address}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-lg">
                  Country
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="country"
                    name="country"
                    defaultValue={listing.country}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate" className="text-lg">
                Daily Rate
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="dailyRate"
                  name="dailyRate"
                  type="number"
                  defaultValue={listing.dailyRate}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Existing Images</Label>
              <div className="flex gap-4 flex-wrap">
                {listing.images?.map((url: string) => (
                  <div key={url} className="relative">
                    <Image
                      src={url}
                      alt="Listing image"
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 rounded-full"
                      onClick={() => handleExistingImageRemove(url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Add New Images</Label>
              <Upload
                listType="picture-card"
                multiple
                beforeUpload={handleImageUpload}
              >
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-6 h-6 mb-2" />
                  <span>Upload</span>
                </div>
              </Upload>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full text-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Listing"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
