"use client";

import { signIn, getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function Login() {
  const [auth, setAuth] = useState(null);
  const session = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (session.status === "authenticated") {
      setAuth(true);
      router.push("/");
    }
    else if (session.status === "unauthenticated") {
      setAuth(false);
    }
  }, [session, router]);

  const login = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
  }

  if (auth === false) {
    return (
      <main className="w-full mt-40 flex flex-col items-center justify-center sm:px-4">
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
              <button className="w-full flex items-center justify-center gap-x-3 py-2.5 mt-5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100" onClick={login} disabled={session.status === "loading"}>
                <Icon icon="devicon:google" />
                Login with Google
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }
}