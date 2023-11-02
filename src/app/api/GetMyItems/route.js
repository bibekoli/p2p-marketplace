import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";
import { getServerSession } from "next-auth";

export async function GET(request) {
  const { db } = await ConnectToDatabase();
  const users = await db.collection("Users");
  const user = await getServerSession();
  if (!user) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const items = await users.aggregate([
    {
      $match: {
        email: user.user.email
      }
    },
    {
      $lookup: {
        from: "Items",
        localField: "_id",
        foreignField: "seller",
        as: "items"
      }
    }
  ]).toArray();
  
  return NextResponse.json(items);
}