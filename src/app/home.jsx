import Link from "next/link";
import Image from "next/image";

export default function Home({ data }) {
  return (
    <main className="max-w-screen-xl mx-auto">
      <div className="mx-2">
        <h1 className="text-2xl font-semibold m-4">Available Item List</h1>
        {
          (data.length > 0) && data.map((item, index) => (
            <Link key={index} className="flex flex-row shadow-lg p-2 gap-4 rounded-lg" href={"/item/" + item._id}>
              <div>
                <Image src={item.images[0]} alt={item.name} width={500} height={500} className="rounded-lg h-64 w-auto border" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{item.name}</h1>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-600">Price: {item.price.amount}</p>
                <p className="text-gray-600">Sold By: {item.sellerName}</p>
              </div>
            </Link>
          ))
        }
      </div>
    </main>
  )
}