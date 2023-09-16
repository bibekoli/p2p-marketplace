import { NextResponse } from "next/server";
import ConnectToDatabase from "@/modules/mongodb";

export async function GET() {
  const { db } = await ConnectToDatabase();
  const users = await db.collection("Users");

  const data = {
    title: "P2P Marketplace",
    description: "Buy and sell things directly without third party.",
    data: await users.find({}).toArray(),
  }

  return NextResponse.json(data);
}