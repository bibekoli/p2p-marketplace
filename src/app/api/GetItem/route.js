import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const { db } = await ConnectToDatabase();
  const items = await db.collection("Items");
  
  const item = await items.findOne({ _id: new ObjectId(id), visibility: "public" });
  delete item.seller;
  delete item.visibility;
  
  if (!item) {
    return NextResponse.json({}, { status: 404 });
  }
  return NextResponse.json(item);
}