import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";
import { getServerSession } from "next-auth";

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const { db } = await ConnectToDatabase();
  const items = await db.collection("Items");
  const users = await db.collection("Users");
  const user = await getServerSession();
  if (!user) {
    NextResponse.json({}, { status: 401 });
  }

  const item = await items.findOne({
    _id: new ObjectId(id),
  });

  if (!item) {
    return NextResponse.json({}, { status: 404 });
  }

  const userSearch = await users.findOne({
    email: user.user.email,
  });

  if (!userSearch) {
    return NextResponse.json({}, { status: 401 });
  }

  if (item.seller.toString() == userSearch._id.toString()) {
    return NextResponse.json(item);
  }
  else {
    return NextResponse.json({}, { status: 401 });
  }
}