import { cookies } from "next/headers";
import MyItemList from "../show";
import ListNotFound from "../404";

async function geUserItems(id) {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/GetUserItems?id=" + id, {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
      cache: "no-store",
    });
    const json = await res.json();
    return json;
  }
  catch(e) {
    return [];
  }
}

export default async function UserList({ params }) {
  const { id } = params;

  const userItems = await geUserItems(id);
  if (!userItems || userItems.length === 0) {
    return (
      <ListNotFound message="This user hasn't listed any items yet" />
    );
  }

  return (
    <MyItemList title={userItems[0].seller_name + "'s Listings"} items={userItems.reverse()} />
  );
}