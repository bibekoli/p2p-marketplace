import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import ConnectToDatabase from "@/modules/mongodb";

export async function POST(request) {
  try {
    const user = await getServerSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { db } = await ConnectToDatabase();
    const items = await db.collection("Items");
    const data = await request.json();

    const seller = await db.collection("Users").findOne({ email: data.tempSellerRef });
    data.seller = seller._id;
    delete data.tempSellerRef;
    
    const response = await items.insertOne(data);
    return NextResponse.json({
      id: response.insertedId,
    });
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}