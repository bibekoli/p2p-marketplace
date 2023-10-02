import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";

export async function POST(request) {
  try {
    const { db } = await ConnectToDatabase();
    const items = await db.collection("Items");
    const data = await request.json();
    const response = await items.insertOne(data);
    return NextResponse.json({
      id: response.insertedId,
    });
  }
  catch (error) {
    return NextResponse.error(error);
  }
}