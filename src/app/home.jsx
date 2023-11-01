"use client";

import Link from "next/link";
import Image from "next/image";
import { deliveryType } from "@/modules/dataRepo";
import { ConvertDateToDaysAgo } from "@/modules/utilities";
import { useState } from "react";
import { Icon } from "@iconify/react";

const ItemCard = ({ item }) => {
  return (
    <Link href={`/item/${item._id}`} className="w-full">
      <div className="flex flex-row shadow-lg p-2 gap-2 rounded-lg">
        <div className="flex-shrink-0">
          <Image
            src={item.images[0]}
            alt={item.name}
            width={256}
            height={256}
            className="rounded-lg h-[200px] w-[200px] border object-cover"
          />
        </div>
        <div className="flex flex-col justify-between gap-2">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <p className="text-gray-600">Price: Rs. {item.price.amount}</p>
          <p className="text-gray-600">Location: {item.my_location}</p>
          <p className="text-gray-600">Category: {item.views}</p>
          <p className="text-gray-600">
            Delivery: {deliveryType[item.delivery.type].type} - {deliveryType[item.delivery.type].area}
            {deliveryType[item.delivery.type].type !== "Door Pickup" && " - Rs. " + item.delivery.cost}
          </p>
          <p className="text-gray-600">Posted {ConvertDateToDaysAgo(item.created_at)}</p>
        </div>
      </div>
    </Link>
  )
};

export default function Home({ data }) {

  const [items, setItems] = useState(data);
  const sortItems = (e) => {
    if (e.target.value === "name-za") {
      setItems([...items].sort((a, b) => b.name.localeCompare(a.name)));
    }
    else if (e.target.value === "name") {
      setItems([...items].sort((a, b) => a.name.localeCompare(b.name)));
    }
    else if (e.target.value === "date") {
      setItems([...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    }
    else if (e.target.value === "date-on") {
      setItems([...items].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
    }
    else if (e.target.value === "price") {
      setItems([...items].sort((a, b) => a.price.amount - b.price.amount));
    }
    else if (e.target.value === "price-hl") {
      setItems([...items].sort((a, b) => b.price.amount - a.price.amount));
    }
    else if (e.target.value === "popular") {
      setItems([...items].sort((a, b) => b.views - a.views));
    }
    else if (e.target.value === "popular-lh") {
      setItems([...items].sort((a, b) => a.views - b.views));
    }
    else if (e.target.value === "default") {
      setItems(data);
    }
  }  

  return (
    <main className="max-w-screen-xl mx-auto mt-[80px]">
      {/* option to sort items by name, date */}
      <div className="flex flex-row justify-end">
        <select className="rounded-lg border-2 border-gray-300 p-2" onChange={sortItems}>
          <option value="default">Default</option>
          <option value="name">Name (A-Z)</option>
          <option value="name-za">Name (Z-A)</option>
          <option value="date">Date (Newest First)</option>
          <option value="date-on">Date (Oldest First)</option>
          <option value="price">Price</option>
          <option value="price-hl">Price (High to Low)</option>
          <option value="popular-lh">Popular (Least Viewed First)</option>
          <option value="popular">Popular (Most Viewed First)</option>
        </select>
      </div>

      <div className="mx-2">
        <h1 className="text-2xl font-semibold m-4">Available Item List</h1>

        <div className="flex flex-col justify-between items-center gap-4">
          {
            (items.length > 0) && items.map((item, index) => (
              <ItemCard item={item} key={index} />
            ))
          }
        </div>
      </div>
    </main>
  )
}