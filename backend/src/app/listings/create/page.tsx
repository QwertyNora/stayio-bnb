"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Form, Upload } from "antd";
import { useUser } from "@/context/user";
import { RcFile } from "antd/es/upload/interface";

export default function CreateListingPage() {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<string[]>([]); // Array to store base64 strings
  const router = useRouter();

  const handleImageChange = ({ fileList }: any) => {
    fileList.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        // Kontrollera att result finns och är en sträng innan uppdatering av state
        if (typeof result === "string") {
          setImageFiles((prev) => [...prev, result]); // Lägg till base64-strängen
        }
      };
      reader.readAsDataURL(file.originFileObj); // Läs filen som en base64-sträng
    });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          address: values.address,
          country: values.country,
          dailyRate: parseFloat(values.dailyRate),
          images: imageFiles, // Include base64-encoded images
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
    <div>
      <h1>Create New Listing</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="dailyRate"
          label="Daily Rate"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Images">
          <Upload
            listType="picture"
            multiple
            beforeUpload={() => false} // Prevent auto-upload
            onChange={handleImageChange}
          >
            <Button>Select Images</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Create Listing
        </Button>
      </Form>
    </div>
  );
}

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
