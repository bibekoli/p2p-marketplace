"use client";

import { useState } from "react";

export default function Form() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [priceStatus, setPriceStatus] = useState("");
  const [images, setImages] = useState([]);
  const [condition, setCondition] = useState({});
  const [delivery, setDelivery] = useState({
    
  });

  return (
    <div className="max-w-screen-xl mx-auto">
      hehe
    </div>
  )
}
