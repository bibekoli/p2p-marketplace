import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import LoginComponent from "./component";


export default async function CreateAd() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return <LoginComponent />;
}