"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Form } from "antd";
import { useUser } from "@/context/user";

export default function CreateListingPage() {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
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
        <Form.Item
          name="dailyRate"
          label="Daily Rate"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Listing
        </Button>
      </Form>
    </div>
  );
}
