"use client";

import Link from "next/link";
import Image from "next/image";
import { ConvertDateToDaysAgo } from "@/modules/utilities";
import { useState } from "react";
import { Icon } from "@iconify/react";

const ItemCard = ({ item }) => {
  return (
    <Link href={`/item/${item._id}`} className="w-full rounded-lg">
      <div className="flex flex-row gap-4 rounded-lg m-2 p-4 hover:bg-gray-100">
        <div className="flex-shrink-0">
          <Image
            src={"https://wsrv.nl?url=" + item.images[0] + "&w=150&h=150&fit=cover&a=attention"}
            alt={item.name}
            width={150}
            height={150}
            className="rounded-lg h-[150px] w-[150px] border object-cover"
          />
        </div>
        <div className="flex flex-col justify-between">
          <h1 className="text-xl font-bold">{item.name}</h1>
          <p className="text-gray-600 flex flex-row items-center gap-2">
              {
                item.price.type === "Free" || item.price.amount === 0 ? (
                  <span className="font-semibold">FREE</span>
                ) : (
                  <>
                    <span className="font-semibold">रु. </span>
                    {item.price.amount.toLocaleString("ne-NP")}
                  </>
                )
              }
          </p>
          <p className="text-gray-600 flex flex-row items-center gap-2">
            <Icon icon="mdi:location" width="20" height="20" />
            {item.my_location}
          </p>
          <p className="text-gray-600 flex flex-row items-center gap-2">
            <Icon icon="material-symbols:category" width="20" height="20" />
            {item.category}
          </p>
          <p className="text-gray-600 flex flex-row items-center gap-2">
            <Icon icon="mingcute:time-fill" width="20" height="20" />
            {ConvertDateToDaysAgo(item.created_at)}
          </p>
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
  }

  function searchFilter(keyword) {
    if (keyword.length > 0) {
      setItems(data.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()) || item.description.toLowerCase().includes(keyword.toLowerCase()) || item.keywords.includes(keyword.toLowerCase()) || item.category.toLowerCase().includes(keyword.toLowerCase())));
    }
    else if (keyword.length === 0) {
      setItems(data);
    }
    else {
      setItems([]);
    }
  }

  return (
    <main className="max-w-screen-xl mx-auto mt-[80px]">
      {/* option to sort items by name, date */}
      <div className="flex flex-row justify-between items-center mx-4 mb-4">
        <h1 className="text-2xl font-semibold">Available Items</h1>
        <select className="rounded-lg border border-gray-300 px-2 h-10" onChange={sortItems}>
          <option value="date">Newest First</option>
          <option value="date-on">Oldest First</option>
          <option value="name">Name (A-Z)</option>
          <option value="name-za">Name (Z-A)</option>
          <option value="price">Price (Low to High)</option>
          <option value="price-hl">Price (High to Low)</option>
          <option value="popular-lh">Least Popular First</option>
          <option value="popular">Most Popular First</option>
        </select>
      </div>

      {/* search box */}
      <div className="flex flex-row justify-between items-center gap-2 mx-4 mb-4">
        <input
          type="text"
          placeholder="Enter search term"
          className="rounded-lg border border-gray-300 px-2 h-[45px] w-full outline-none"
          onChange={(e) => searchFilter(e.target.value)}
        />
      </div>
      <div className="mx-2">
        {
          (items.length === 0) && (
            <div className="flex flex-col justify-center items-center gap-2 mt-14">
              <Icon icon="akar-icons:search" width="50" height="50" />
              <p className="text-gray-600 text-xl">No results found</p>
            </div>
          )
        }
        <div className="flex flex-col justify-between items-center gap-2">
          {
            (items.length > 0) && items.map((item, index) => (
              <div key={index} className="w-full">
                <ItemCard item={item} />
                <hr className="border-gray-300 w-full" />
              </div>
            ))
          }
        </div>
      </div>
    </main>
  )
}