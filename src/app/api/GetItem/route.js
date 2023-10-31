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

  const item = await items.findOneAndUpdate({ 
    _id: new ObjectId(id),
  }, {
    $inc: {
      views: 1
    }
  });

  if (!item) {
    return NextResponse.json({}, { status: 404 });
  }

  const sellerRes = await users.findOne({ _id: new ObjectId(item.seller) });
  item.seller_name = sellerRes.name;

  if (user) {
    const userSearch = await users.findOne({ email: user.user.email });
    item.selfOwned = item.seller.toString() == userSearch._id.toString();
    return NextResponse.json(item);
  }
  else {
    item.selfOwned = false;
    if (item.visibility == "private") {
      return NextResponse.json({});
    }
    return NextResponse.json(item);
  }
}