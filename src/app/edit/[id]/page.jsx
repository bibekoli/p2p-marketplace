import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import Form from "../../create/form";

async function getItem(id) {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/GetItemEverything?id=" + id, {
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
    return {};
  }
}

export default async function EditAd({ params }) {
  const { id } = params;
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const item = await getItem(id);
  if (!item || !item._id) {
    redirect("/");
  }

  return <Form item={item} />;
}