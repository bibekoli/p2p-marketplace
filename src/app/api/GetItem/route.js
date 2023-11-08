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

  // get all items to calculate related items using Collaborative Filtering algorithm
  // compare current item with all other items, check comparision factors and calculate similarity score:
  // - same category: +3
  // - each item has array of keywords, each same keyword: +1
  // - same words in name: +1 for each word
  // - same seller: +1

  const allItems = await items.find({
    visibility: "public",
    status: "available"
  }).toArray();

  const related = [];
  for (const items of allItems) {
    if (items._id.toString() == id) continue;
    let score = 0;
    if (items.category == item.category) score += 3;
    for (const word of items.keywords) {
      if (item.keywords.includes(word)) score += 1;
    }
    for (const word of item.keywords) {
      if (items.keywords.includes(word)) score += 1;
    }
    for (const word of items.name.split(" ")) {
      if (item.name.split(" ").includes(word)) score += 1;
    }
    if (items.seller.toString() == item.seller.toString()) score += 1;
    if (score > 0) {
      related.push({
        ...items,
        score: score
      });
    }
  }
  related.sort((a, b) => {
    return b.score - a.score;
  });
  related.splice(12);

  // if related is less than 12, fill with random items that are not in related using allItems
  // if (related.length < 12) {
  //   const used = [];
  //   for (const item of related) {
  //     used.push(item._id.toString());
  //   }
  //   for (const item of allItems) {
  //     if (related.length == 12) break;
  //     if (used.includes(item._id.toString())) continue;
  //     related.push(item);
  //   }
  // }

  response.item = item;
  response.related = related;

  return NextResponse.json(response);
}