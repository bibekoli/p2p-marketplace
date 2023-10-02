import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    const data = await req.formData();
    const image = data.get("image");
    const type = data.get("type");
    const buffer = Buffer.from(await image.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: "image", folder: type }, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      })
      .end(buffer);
    });

    return NextResponse.json({
      image: result.secure_url,
    });
  }
  catch (error) {
    return NextResponse.error(error);
  }
}
