import Home from "@/app/home";

async function getData() {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/GetData", { cache: "no-store" });
    const json = await res.json();
    return json;
  }
  catch(e) {
    return {};
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