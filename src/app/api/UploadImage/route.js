import { NextResponse } from "next/server";
import UploadImage from "@/modules/upload-image";

export async function POST(request) {
  const body = await request.json();
  
  const result = await UploadImage(+new Date(), body.image);
  if (result.status === "success") {
    return NextResponse.json({
      image: result.data
    });
  }
  else {
    return NextResponse.json({
      message: "Failed To Upload Image"
    });
  }
}