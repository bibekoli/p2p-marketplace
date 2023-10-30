"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";

export default function LoginComponent() {
  const login = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
  }

  return (
    <main className="w-full mt-60 flex flex-col items-center justify-center sm:px-4">
      <div className="bg-white shadow rounded-md p-4 py-6 sm:p-6 sm:rounded-lg flex justify-center w-[90%] m-4 max-w-md">
        <div>
          <div className="flex items-center justify-center text-2xl font-bold">
            Login to
          </div>
          <Image
            src="/logo.png"
            width={300}
            height={100}
            alt="BechnuParyo"
          />
          <div className="mt-5">
            <button className="w-full flex items-center justify-center gap-x-3 py-2.5 mt-5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100" onClick={login}>
              <Icon icon="devicon:google" />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}