import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import MyItemList from "./show";
import ListNotFound from "./404";

async function getMyItems() {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/GetMyItems", {
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

export default async function MyItems() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const myItems = await getMyItems();
  if (!myItems || myItems[0].items.length === 0) {
    return (
      <ListNotFound message="You haven't listed any items yet" />
    );
  }

  return (
    <MyItemList items={myItems[0].items.reverse()} title="My Items" owner="me" />
  );
}