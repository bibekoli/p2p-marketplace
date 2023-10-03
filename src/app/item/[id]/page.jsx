import ItemClient from "./client";

async function getItem(id) {
  const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/GetItem?id=" + id);
  const json = await res.json();
  return json;
}


export default async function Item({ params }) {
  const { id } = params;
  const item = await getItem(id);

  return <ItemClient item={item} />;
}