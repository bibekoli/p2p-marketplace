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
    <nav className={`md:text-sm bg-gray-100 ${state ? "shadow-lg rounded-xl border md:shadow-none md:border-none md:mt-0" : ""}`}>
      <div className="ms:flex justify-between flex-row gap-x-14 items-center max-w-screen-xl mx-auto md:flex">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              width={300}
              height={100}
              alt="BechnuParyo"
            />
          </Link>
          <button className="menu-btn bg-gray-200 hover:bg-gray-300 rounded-md md:hidden mr-2" onClick={() => setState(!state)}>
            {
            state ? (
              <Icon icon="ci:close-md" width={35} height={35} />
              ) : (
                <Icon icon="ci:hamburger-md" width={35} height={35} />
              )
            }
          </button>
        </div>
        <div className={`mt-8 md:mt-0 md:flex ${state ? "block" : "hidden"}`}>
          <ul className="space-y-6 md:flex md:space-x-6 md:space-y-0 px-4 md:px-0">
            {
              navigation.map((item, index) => {
                return (
                  <li key={index} className="text-gray-700 hover:text-gray-900 font-bold">
                    <Link href={item.path} className="block">
                      {item.title}
                    </Link>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div className={`${state ? "block" : "hidden"} md:flex md:items-center md:justify-end md:space-x-6 md:space-y-0`}>
          {
            (status === "authenticated") && (
              <div className="flex-1 gap-x-6 items-center justify-end mt-3 md:flex md:space-y-0 md:mt-0 cursor-pointer px-2 pb-4 ms:px-0 md:pb-0">
                <div className="flex items-center justify-center gap-2 bg-gray-200 rounded-full px-1 py-2 md:py-1">
                <Image
                  src={user.image}
                  width={40}
                  height={40}
                  alt={user.name}
                  className="rounded-full shadow-md"
                />
                <span className="inline-block md:hidden font-bold">{user.name}</span>
                </div>
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
              <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0 md:mr-1 px-2 pb-4 ms:px-0 md:pb-0">
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