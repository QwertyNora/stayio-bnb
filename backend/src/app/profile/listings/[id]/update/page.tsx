"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, InputNumber, Button, message } from "antd";
import { useUser } from "@/context/user";
import { fetchWithToken } from "@/utils/fetchWithToken";

export default function UpdateListingPage({
  params,
}: {
  params: { id: string };
}) {
  const { token } = useUser();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchListing = async () => {
      if (token) {
        try {
          const data = await fetchWithToken(
            `/api/listings/${params.id}`,
            token
          );
          setListing(data);
          form.setFieldsValue(data);
        } catch (error) {
          console.error("Failed to fetch listing", error);
          message.error("Failed to load listing data");
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    };

    fetchListing();
  }, [token, params.id, form]);

  const onFinish = async (values: any) => {
    if (token) {
      try {
        const updatedListing = await fetchWithToken(
          `/api/listings/${params.id}`,
          token,
          {
            method: "PUT",
            body: JSON.stringify(values),
          }
        );
        message.success("Listing updated successfully");
        router.push("/profile/listings");
      } catch (error) {
        console.error("Failed to update listing", error);
        message.error("Failed to update listing");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!listing) return <p>Listing not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Update Listing</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={listing}
      >
        <Form.Item name="title" label="Title">
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter description" />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input placeholder="Enter address" />
        </Form.Item>
        <Form.Item name="country" label="Country">
          <Input placeholder="Enter country" />
        </Form.Item>
        <Form.Item name="dailyRate" label="Daily Rate">
          <InputNumber
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Listing
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
