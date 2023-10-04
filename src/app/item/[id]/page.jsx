import ItemNotFound from "./404";
import ItemClient from "./client";

async function getItem(id) {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/GetItem?id=" + id);
    const json = await res.json();
    return json;
  }
  catch(e) {
    return {};
  }
}


export default async function Item({ params }) {
  const { id } = params;
  const item = await getItem(id);

  if (Object.keys(item).length === 0) {
    return <ItemNotFound />;
  }

  return <ItemClient item={item} />;
}