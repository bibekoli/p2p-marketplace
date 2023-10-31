"use client";

import ImageCarousel from "@/components/ImageCarousel";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ItemClient({ item }) {
  const session = useSession();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [chatIcon, setChatIcon] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      setChatIcon("majesticons:chat-line");
    }
    else if (session.status === "unauthenticated") {
      setChatIcon("material-symbols:lock-outline");
    }
    else {
      setChatIcon("eva:loader-outline");
    }
  }, [session]);

  const chatButtonClicked = async () => {
    if (item.selfOwned) {
      router.push(`/edit/${item._id}`);
      return;
    }
    
    if (session.status === "authenticated") {
      setChatLoading(true);
      const data = {
        item_id: item._id,
        temp_buyer_email: session.data.user.email,
        seller_id: item.seller,
      };

      axios.post("/api/chats/create", data)
      .then((res) => {
        if (res.status === 200) {
          router.push(`/message/${res.data._id}`);
        }
      })
      .catch((err) => {
        setChatLoading(false);
        Swal.fire({
          title: "Error",
          text: err.response.data.error,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
    }
    else if (session.status === "unauthenticated") {
      Swal.fire({
        title: "Login Required",
        text: "You must be logged in to chat with the seller.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
    }
  }

  return (
    <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto mt-[80px]">
      <div className={`flex flex-col md:w-1/2 m-4 relative rounded-xl`}>
        <ImageCarousel images={item.images} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex} />
        <div className="my-4 flex justify-between">
          <span className={`font-[500] flex items-center`}>
            <Icon icon="tabler:eye" width={24} height={24} className={`mr-1`} />
            {item.views} Views
          </span>
          <button
            disabled={chatLoading}
            className={`font-[500] flex items-center text-white px-4 py-2 rounded-xl ${chatLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            onClick={chatButtonClicked}>
              {
              item.selfOwned ? (
                <>
                  <Icon icon="bx:edit" width={24} height={24} className={`mr-1`} />
                  Edit Item
                </>
              ) : (
                <>
                  {chatLoading ? (
                    <>
                      <Icon icon="eva:loader-outline" width={24} height={24} className={`mr-1 animate-spin`} />
                      Opening Chat
                    </>
                  ) : (
                    <>
                      <Icon icon={chatIcon} width={24} height={24} className={`mr-1`} />
                      Chat With Seller
                    </>
                  )}
                </>
              )
            }
          </button>
        </div>
      </div>
      <div className="flex flex-col md:w-1/2 m-4">
        <h1 className={`text-3xl font-[800] flex items-center gap-2`}>
          {/* show lock icon */}
          {
            item.visibility === "public" ? (
              <Icon icon="bx:globe" width={28} height={28} className={`mr-1`} />
            ) : (
              <Icon icon="bx:lock" width={28} height={28} className={`mr-1`} />
            )
          }
          {item.name}
        </h1>
        <p className={`text-xl font-[500]`}>{item.description}</p>
      </div>
    </div>
  )
}