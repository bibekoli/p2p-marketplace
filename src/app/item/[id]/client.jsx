"use client";

import ImageCarousel from "@/components/ImageCarousel";
import { useState } from "react";

export default function ItemClient({ item }) {
  console.log(item);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto">
      <div className={`flex flex-col md:w-1/2 m-4 relative rounded-xl`}>
        <ImageCarousel images={item.images} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex} />
      </div>
      <div className="flex flex-col md:w-1/2 m-4">
        <h1 className={`text-3xl font-[800]`}>{item.name}</h1>
        <p className={`text-xl font-[500]`}>{item.description}</p>
      </div>
    </div>
  )
}