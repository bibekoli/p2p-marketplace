import Image from "next/image";

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
  title: process.env.NEXT_PUBLIC_APP,
  description: "A platform where people can buy and sell things directly with another person without the involvemant of third party.",
};

export default async function Home() {
  const data = await getData();
  // console.log(data);
  return (
    <main className="max-w-screen-xl mx-auto">
      <div className="mx-2">
        <h1 className="text-2xl font-semibold m-4">Available Item List</h1>
        {
          (data.length > 0) && data.map((item, index) => (
              <div key={index} className="flex flex-row shadow-lg p-2 gap-4 rounded-lg">
                <div>
                  <Image src={item.images[0]} alt={item.name} width={500} height={500} className="rounded-lg h-64 w-auto border" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{item.name}</h1>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-gray-600">Price: {item.price.amount}</p>
                  <p className="text-gray-600">Sold By: {item.sellerName}</p>
                </div>
              </div>
            ))
        }
      </div>
    </main>
  )
}