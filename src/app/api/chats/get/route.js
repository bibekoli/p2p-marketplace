import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";
import { getServerSession } from "next-auth";

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const user = await getServerSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { db } = await ConnectToDatabase();
  const chats = await db.collection("Chats");
  const chat = await chats.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: "Users",
        let: { email: user.user.email },
        pipeline: [
          { $match: { $expr: { $eq: ["$email", "$$email"] } } },
          { $project: { _id: 1, name: 1 } }
        ],
        as: "currentUser"
      }
    },
    {
      $lookup: {
        from: "Items",
        localField: "item",
        foreignField: "_id",
        as: "itemInfo"
      }
    },
  ]).toArray();

  if (chat.length === 0) {
    return NextResponse.json({ error: "Chat doesn't exist or you don't have access to this chat." }, { status: 403 });
  }

  const currentUser = chat[0].currentUser[0];
  const chatUsers = chat[0].users;
  const isUserInChat = chatUsers.find(user => user._id.toString() === currentUser._id.toString());
  if (!isUserInChat) {
    return NextResponse.json({ error: "Chat doesn't exist or you don't have access to this chat." }, { status: 403 });
  }

  return NextResponse.json(chat);
}