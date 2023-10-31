import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import ConnectToDatabase from "@/modules/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const user = await getServerSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { db } = await ConnectToDatabase();
    const chats = await db.collection("Chats");
    const data = await request.json();

    const buyer = await db.collection("Users").findOne({ email: data.temp_buyer_email });
    const seller = await db.collection("Users").findOne({ _id: new ObjectId(data.seller_id) });
    const chatInit = {
      item: new ObjectId(data.item_id),
      users: [
        {
          _id: new ObjectId(seller._id),
          name: seller.name,
        },
        {
          _id: new ObjectId(buyer._id),
          name: buyer.name,
        }
      ],
      messages: [],
    }

    const chat = await chats.findOne({
      $and: [
        { item: new ObjectId(data.item_id) },
        { "users._id": new ObjectId(seller._id) },
        { "users._id": new ObjectId(buyer._id) },
      ]
    });
    if (chat) {
      return NextResponse.json({
        _id: chat._id,
      });
    }

    const response = await chats.insertOne(chatInit);
    return NextResponse.json({
      _id: response.insertedId,
    });
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}