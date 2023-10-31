import { cookies } from "next/headers";
import ItemNotFound from "./404";
import ItemClient from "./client";

async function getItem(id) {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/GetItem?id=" + id, {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
      cache: "no-store"
    });
    const json = await res.json();
    return json;
  }
  catch(e) {
    return {};
  }
}

export const metadata = {};

export default async function Item({ params }) {
  const { id } = params;
  const item = await getItem(id);
  metadata.title = item.name;
  metadata.description = item.description;

  if (Object.keys(item).length <= 1) {
    return <ItemNotFound />;
  }

  return <ItemClient item={item} />;
}