"use client";

import { useState } from "react";

export default function ItemClient({ item }) {
  const [n, setn] = useState(1);
  return (
    <div>
    <h1>{n}</h1>

    <button onClick={() => setn(n + 1)}>+</button>
    </div>
  )
}