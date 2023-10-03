import ItemClient from "./client";

async function getItem(id) {
  const res = await fetch("/api/GetIItem");

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}


export default async function Item({ params }) {
  const { id } = params;
  const item = await getItem(id);

  console.log(params);

  return (
    <div>
      <ItemClient  />
    </div>
  )
}