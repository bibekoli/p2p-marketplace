import Home from "@/app/home";
import { cookies } from "next/headers";

async function getData() {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/GetData", {
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
    console.log(e);
    return [];
  }
}

export const metadata = {
  title: "BechnuParyo",
  description: "A platform where people can buy and sell things directly with another person without the involvemant of third party.",
};

export default async function Index() {
  const data = await getData();

  return <Home data={data.reverse()} />;
}