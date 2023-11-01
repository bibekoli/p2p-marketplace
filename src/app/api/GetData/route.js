import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";

export async function GET() {
  const { db } = await ConnectToDatabase();
  const items = await db.collection("Items");
  
  const allItems = await items.aggregate([
    {
      $match: { visibility: "public" }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        images: 1,
        condition: 1,
        category: 1,
        price: 1,
        delivery: 1,
        my_location: 1,
        status: 1,
        seller: 1,
        keywords: 1,
        created_at: 1,
      }
    }
  ])
  .toArray();

  return NextResponse.json(allItems);
}