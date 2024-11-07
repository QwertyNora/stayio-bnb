import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { image } = req.body;

    try {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "listings",
      });

      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      res.status(500).json({ error: "Image upload failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
