import Image from "next/image";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <main className="max-w-screen-xl mx-auto">
      <div className="mx-2">
        Start here
      </div>
    </main>
  )
}