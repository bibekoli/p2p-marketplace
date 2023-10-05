import ItemNotFound from "./404";
import ItemClient from "./client";

async function getItem(id) {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/GetItem?id=" + id, { cache: "no-store" });
    const json = await res.json();
    console.log("api called");
    return json;
  }
  catch(e) {
    return {};
  }
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const item = await getItem(id);
  
  if (Object.keys(item).length > 1) {
    return {
      title: item.name,
      description: item.description,
    };
  }
}

export default async function Item({ params }) {
  const { id } = params;
  const item = await getItem(id);

  if (Object.keys(item).length <= 1) {
    return <ItemNotFound />;
  }

  return <ItemClient item={item} />;
}