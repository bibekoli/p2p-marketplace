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

  const response = {};

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
  if (item.visibility == "private") {
    return NextResponse.json({});
  }

  // getting seller name and product ownership
  const sellerRes = await users.findOne({ _id: new ObjectId(item.seller) });
  item.seller_name = sellerRes.name;
  if (user) {
    const userSearch = await users.findOne({ email: user.user.email });
    item.selfOwned = item.seller.toString() == userSearch._id.toString();
  }
  else {
    item.selfOwned = false;
  }

  // getting 24 related products based on same category, keywords, title words, description words (in that order) if no at least 24 products found, then it will get 24 random products
  // exclude status: "sold" and visibility: "private" and current item
  const related = await items.aggregate([
    {
      $match: {
        $and: [
          { _id: { $ne: new ObjectId(id) } },
          { status: { $ne: "sold" } },
          { visibility: { $ne: "private" } },
          { $or: [
            { category: item.category },
            { keywords: { $in: item.keywords } },
            { name: { $in: item.name.split(" ") } },
            { description: { $in: item.description.split(" ") } },
          ] }
        ]
      }
    },
    { $sample: { size: 24 } }
  ]).toArray();

  if (related.length < 24) {
    // excluding current item and related items
    // const random = await items.aggregate([{ $sample: { size: 24 - related.length } }]).toArray();
    const random = await items.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: new ObjectId(id) } },
            { _id: { $nin: related.map(item => item._id) } },
            { status: { $ne: "sold" } },
            { visibility: { $ne: "private" } },
          ]
        }
      },
      { $sample: { size: 24 - related.length } }
    ]).toArray();
    related.push(...random);
  }

  response.item = item;
  response.related = related;

  return NextResponse.json(response);
}