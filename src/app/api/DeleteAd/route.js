import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import ConnectToDatabase from "@/modules/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const user = await getServerSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { db } = await ConnectToDatabase();
    const items = await db.collection("Items");
    const data = await request.json();

    if (data.id) {
      await items.deleteOne({ _id: new ObjectId(data.id) });

      return NextResponse.json({
        message: "Success"
      });
    }
    else {
      return NextResponse.json({
        message: "Invalid ID"
      }, { status: 400 });
    }
  }
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}