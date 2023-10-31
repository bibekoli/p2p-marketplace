import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";
import { getServerSession } from "next-auth";

export async function GET() {
  const user = await getServerSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { db } = await ConnectToDatabase();
  const users = db.collection("Users");
  const chats = db.collection("Chats");

  const currentUser = await users.findOne({ email: user.user.email });
  const result = await chats.aggregate([
    { $match: { "users._id": currentUser._id } },
    {
      $lookup: {
        from: "Items",
        localField: "item",
        foreignField: "_id",
        as: "itemInfo"
      }
    },
    {
      $unwind: "$itemInfo"
    },
    {
      $project: {
        _id: 1,
        users: 1,
        messages: {
          $slice: [
            {
              $map: {
                input: "$messages",
                as: "message",
                in: {
                  $mergeObjects: [
                    "$$message",
                    {
                      sender: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$users",
                              as: "user",
                              cond: {
                                $eq: ["$$user._id", "$$message.sender"]
                              }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            },
            -1
          ]
        },
        me: {
          $filter: {
            input: "$users",
            as: "user",
            cond: {
              $eq: ["$$user._id", currentUser._id]
            }
          }
        },
        
        "itemInfo.name": 1,
        "itemInfo.images": 1
      }
    }
  ]).toArray();
  
  return NextResponse.json(result);
}