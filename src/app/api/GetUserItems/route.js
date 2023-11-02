import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";
import { getServerSession } from "next-auth";

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");

  if (!ObjectId.isValid(id)) {
    return NextResponse.json([]);
  }

  const { db } = await ConnectToDatabase();
  const users = await db.collection("Users");
  const items = await db.collection("Items");

  const userItems= await items.find({
    seller: new ObjectId(id),
  }).toArray();

  if (userItems.length != 0) {
    const sellerRes = await users.findOne({ _id: new ObjectId(id) });
    userItems[0].seller_name = sellerRes.name;
  }
  else {
    return NextResponse.json([]);
  }

  return NextResponse.json(userItems);
}