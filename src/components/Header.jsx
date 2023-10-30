"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";

export default function Header() {
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
    {
      title: "Home",
      path: "/",
      icon: "ic:baseline-home",
    },
    {
      title: "Recent",
      path: "/new",
      icon: "ic:baseline-history",
    },
    {
      title: "Categories",
      path: "/categories",
      icon: "carbon:category",
    },
    {
      title: "About Us",
      path: "/about",
      icon: "ic:baseline-info",
    },
    {
      title: "Contact Us",
      path: "/contact",
      icon: "ic:baseline-contact-page",
    },
  ];

  return (
    <div className="shadow">
      <div className="navbar bg-base-100 max-w-screen-xl mx-auto">
        <div className="navbar-start">
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </label>
            <ul tabIndex={0} className="dropdown-content font-medium z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-48">
              {
                navigation.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link href={item.path}>
                        <Icon icon={item.icon} width={25} height={25} />
                        {item.title}
                      </Link>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
        <div className="navbar-center cursor-pointer">
          <Link href="/">
            <Image src={"/logo.png"} width={250} height={80} alt="BechnuParyo" />
          </Link>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <Icon icon="ic:round-search" width={22} height={22} />
          </button>
          <div className="dropdown dropdown-hover dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
              {
                (status === "authenticated") && (
                  <Image
                    src={user.image}
                    width={35}
                    height={35}
                    alt={user.name}
                    className="rounded-full shadow-md"
                  />
                )
              }
              {
                (status === "loading") && (
                  <Icon icon="la:spinner" className="animate-spin" width={30} height={30} />
                )
              }
              {
                (status === "unauthenticated") && (
                  <Icon icon="teenyicons:user-circle-solid" width={35} height={35} />
                )
              }
            </button>
            <ul tabIndex={0} className="dropdown-content font-medium z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-48">
              {
                (status === "authenticated") && (
                  <>
                    <li>
                      <Link href={`/account`}>
                        <Image src={user.image} width={25} height={25} alt={user.name} className="rounded-full shadow-md" />
                        My Account
                      </Link>
                    </li>
                    <li>
                      <Link href="/create">
                        <Icon icon="gala:add" width={25} height={25} />
                        Post Ad
                      </Link>
                    </li>
                    <li>
                      <p onClick={() => signOut()}>
                        <Icon icon="material-symbols:logout-rounded" width={25} height={25} />
                        Logout
                      </p>
                    </li>
                  </>
                )
              }
              {
                (status === "loading") && (
                  <li>
                    <Icon icon="la:spinner" className="animate-spin" width={25} height={25} />
                    Loading
                  </li>
                )
              }
              {
                (status === "unauthenticated") && (
                  <li>
                    <Link href="/login">
                      <Icon icon="ic:round-login" width={25} height={25} />
                      Login
                    </Link>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}