import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";

export async function GET(request) {
  const { db } = await ConnectToDatabase();
  const items = await db.collection("Items");
  
  const allItems = await items.find({ visibility: "public" }, { projection: { visibility: 0 } }).toArray();
  return NextResponse.json(allItems);
}