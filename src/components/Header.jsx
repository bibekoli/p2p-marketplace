"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { getSession } from "next-auth/react";

export default function Header() {
  const [state, setState] = useState(false);
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setStatus("authenticated");
        setUser(session.user);
      } else {
        setStatus("unauthenticated");
      }
    });
  }
  , []);

  const navigation = [
    { title: "Popular", path: "/popular" },
    { title: "Recent", path: "/recent" },
    { title: "Categories", path: "/categories" },
    { title: "About", path: "/about" },
  ];

  useEffect(() => {
    document.onclick = (e) => {
      const target = e.target;
      if (!target.closest(".menu-btn")) setState(false);
    };
  }, []);

  return (
    <nav className={`bg-white md:text-sm ${state ? "shadow-lg rounded-xl border  mt-2 md:shadow-none md:border-none md:mt-0" : ""}`}>
      <div className="gap-x-14 items-center max-w-screen-xl mx-auto md:flex">
        <div className="flex items-center justify-between mx-2 my-1">
          <Link href="/">
            <Image
              src="/logo.png"
              width={300}
              height={100}
              alt="P2P Marketplace"
            />
          </Link>
          <button className="menu-btn text-gray-500 hover:text-gray-800 md:hidden" onClick={() => setState(!state)}>
            {
            state ? (
              <Icon icon="ci:close-md" width={35} height={35} />
              ) : (
                <Icon icon="ci:hamburger-md" width={35} height={35} />
              )
            }
          </button>
        </div>
        <div className={`flex-1 items-center mt-8 md:mt-0 md:flex ${state ? "block" : "hidden"} `}>
          <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {
              navigation.map((item, index) => {
                return (
                  <li key={index} className="text-gray-700 hover:text-gray-900">
                    <Link href={item.path} className="block">
                      {item.title}
                    </Link>
                  </li>
                );
              })
            }
          </ul>
          {
            (status === "authenticated") && (
              <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0 md:mr-2 cursor-pointer">
                <Image
                  src={user.image}
                  width={40}
                  height={40}
                  alt={user.name}
                  className="rounded-full shadow-md"
                />
              </div>
            )
          }
          {
            (status === "loading") && (
              <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0 md:mr-2">
                <Icon icon="la:spinner" className="animate-spin" width={30} height={30} />
              </div>
            )
          }
          {
            (status === "unauthenticated") && (
              <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0 md:mr-2">
                <Link href="/login" className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                  Sign in
                  <Icon icon="mingcute:right-fill" />
                </Link>
              </div>
            )
          }
        </div>
      </div>
    </nav>
  );
}
