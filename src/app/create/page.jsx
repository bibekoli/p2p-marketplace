import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Form from "./form";

export default async function CreateAd() {
  const session = await getServerSession();
  console.log(session);
  if (!session) {
    redirect("/login");
  }

  return <Form />;
}