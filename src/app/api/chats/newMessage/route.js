import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import ConnectToDatabase from "@/modules/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({
        error: "Unauthorized"
      },
      { status: 401 });
    }

    const { db } = await ConnectToDatabase();
    const chats = await db.collection("Chats");

    const data = await request.json();
    const chatId = data.chatId;
    data._id = new ObjectId();
    data.sender = new ObjectId(data.sender);
    delete data.chatId;

    const response = await chats.updateOne(
      { _id: new ObjectId(chatId) },
      { $push: { messages: data } }
    );

    if (response.modifiedCount === 0) {
      return NextResponse.json({
        error: "Message not sent"
      },
      { status: 500 });
    }

    return NextResponse.json({
      _id: data._id
    });
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}