"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user";
import { motion } from "framer-motion";
import { Upload } from "antd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Home,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function CreateListingPage() {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const router = useRouter();

  const handleImageChange = ({ fileList }: any) => {
    fileList.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setImageFiles((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file.originFileObj);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          address: formData.get("address"),
          country: formData.get("country"),
          dailyRate: parseFloat(formData.get("dailyRate") as string),
          images: imageFiles,
        }),
      });

      if (response.ok) {
        router.push("/profile/listings");
      } else {
        console.error("Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Create New Listing
          </CardTitle>
          <CardDescription>
            Fill in the details to create your new listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg">
                Title
              </Label>
              <Input id="title" name="title" required className="text-lg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
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
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Images</Label>
              <Upload
                listType="picture-card"
                multiple
                beforeUpload={() => false}
                onChange={handleImageChange}
              >
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-6 h-6 mb-2" />
                  <span>Upload</span>
                </div>
              </Upload>
            </div>

            <Button type="submit" disabled={loading} className="w-full text-lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button, Input, Form, Upload } from "antd";
// import { useUser } from "@/context/user";
// import { RcFile } from "antd/es/upload/interface";

// export default function CreateListingPage() {
//   const { token } = useUser();
//   const [loading, setLoading] = useState(false);
//   const [imageFiles, setImageFiles] = useState<string[]>([]); // Array to store base64 strings
//   const router = useRouter();

//   const handleImageChange = ({ fileList }: any) => {
//     fileList.forEach((file: any) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const result = reader.result;
//         // Kontrollera att result finns och är en sträng innan uppdatering av state
//         if (typeof result === "string") {
//           setImageFiles((prev) => [...prev, result]); // Lägg till base64-strängen
//         }
//       };
//       reader.readAsDataURL(file.originFileObj); // Läs filen som en base64-sträng
//     });
//   };

//   const handleSubmit = async (values: any) => {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/listings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Send JWT token
//         },
//         body: JSON.stringify({
//           title: values.title,
//           description: values.description,
//           address: values.address,
//           country: values.country,
//           dailyRate: parseFloat(values.dailyRate),
//           images: imageFiles, // Include base64-encoded images
//         }),
//       });

//       if (response.ok) {
//         router.push("/profile/listings");
//       } else {
//         console.error("Failed to create listing");
//       }
//     } catch (error) {
//       console.error("Error creating listing:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Create New Listing</h1>
//       <Form onFinish={handleSubmit}>
//         <Form.Item name="title" label="Title" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="description"
//           label="Description"
//           rules={[{ required: true }]}
//         >
//           <Input.TextArea />
//         </Form.Item>
//         <Form.Item name="address" label="Address" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item name="country" label="Country" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="dailyRate"
//           label="Daily Rate"
//           rules={[{ required: true }]}
//         >
//           <Input type="number" />
//         </Form.Item>

//         <Form.Item label="Images">
//           <Upload
//             listType="picture"
//             multiple
//             beforeUpload={() => false} // Prevent auto-upload
//             onChange={handleImageChange}
//           >
//             <Button>Select Images</Button>
//           </Upload>
//         </Form.Item>

//         <Button type="primary" htmlType="submit" loading={loading}>
//           Create Listing
//         </Button>
//       </Form>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button, Input, Form } from "antd";
// import { useUser } from "@/context/user";

// export default function CreateListingPage() {
//   const { token } = useUser();
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (values: any) => {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/listings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Skicka JWT-token
//         },
//         body: JSON.stringify({
//           title: values.title,
//           description: values.description,
//           address: values.address,
//           country: values.country,
//           dailyRate: parseFloat(values.dailyRate), // Konvertera dailyRate till nummer
//         }),
//       });

//       if (response.ok) {
//         router.push("/profile/listings");
//       } else {
//         console.error("Failed to create listing");
//       }
//     } catch (error) {
//       console.error("Error creating listing:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Create New Listing</h1>
//       <Form onFinish={handleSubmit}>
//         <Form.Item name="title" label="Title" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="description"
//           label="Description"
//           rules={[{ required: true }]}
//         >
//           <Input.TextArea />
//         </Form.Item>

//         <Form.Item name="address" label="Address" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>

//         <Form.Item name="country" label="Country" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>

//         <Form.Item
//           name="dailyRate"
//           label="Daily Rate"
//           rules={[{ required: true }]}
//         >
//           <Input type="number" />
//         </Form.Item>
//         <Button type="primary" htmlType="submit" loading={loading}>
//           Create Listing
//         </Button>
//       </Form>
//     </div>
//   );
// }
