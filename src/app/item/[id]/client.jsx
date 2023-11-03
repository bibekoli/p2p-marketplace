"use client";

import ImageCarousel from "@/components/ImageCarousel";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deliveryType } from "@/modules/dataRepo";
import { ConvertDateToDaysAgo } from "@/modules/utilities";
import Image from "next/image";

const TableRow = ({ label, value }) => (
  <tr className="border-b">
    <td className="p-2 font-[500]">{label}</td>
    <td className="p-2 font-[500] text-gray-600">{value}</td>
  </tr>
);

const renderPrice = (item) => {
  if (item.price.type === "Fixed" || item.price.type === "Negotiable") {
    return (
      <>
        <span className={`font-[600] text-gray-700`}>रु. </span>
        {item.price.amount.toLocaleString("ne-NP")}
      </>
    );
  } else {
    return "FREE";
  }
};

const renderDeliveryCost = (cost) => {
  if (cost === 0) {
    return "FREE";
  } else {
    return (
      <>
        <span className={`font-[600] text-gray-700`}>रु. </span>
        {cost.toLocaleString("ne-NP")}
      </>
    );
  }
};

export default function ItemClient({ item, related }) {
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
    <>
      <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto mt-[80px]">
        <div className={`flex flex-col md:w-1/2 m-4 relative rounded-xl`}>
          <ImageCarousel images={item.images} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex} />
          <div className="my-4 flex justify-between">
            <span className={`font-[500] flex items-center`}>
              <Icon icon="tabler:eye" width={24} height={24} className={`mr-1`} />
              {item.views} Views
            </span>
            <button
              disabled={chatLoading || item.status === "sold" && !item.selfOwned}
              className={`font-[500] flex items-center text-white px-4 py-2 rounded-xl ${(chatLoading || item.status === "sold" && !item.selfOwned) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
              onClick={chatButtonClicked}>
              {
                item.selfOwned ? (
                  <>
                    <Icon icon="bx:edit" width={24} height={24} className={`mr-1`} />
                    Edit Item
                  </>
                ) : (
                  <>
                    {
                      item.status === "sold" ? (
                        <>
                          <Icon icon="bx:bx-check" width={24} height={24} className={`mr-1`} />
                          Sold Out
                        </>
                      ) : (
                        chatLoading ? (
                          <>
                            <Icon icon="eva:loader-outline" width={24} height={24} className={`mr-1 animate-spin`} />
                            Opening Chat
                          </>
                        ) : (
                          <>
                            <Icon icon={chatIcon} width={24} height={24} className={`mr-1`} />
                            Chat With Seller
                          </>
                        )
                      )
                    }
                  </>
                )
              }
            </button>
          </div>
        </div>
        <div className="flex flex-col md:w-1/2 m-4">
          <h1 className={`text-2xl font-[800] flex items-center gap-2`}>
            {item.name}
          </h1>

          <table className="w-full border mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Attribute</th>
                <th className="p-2">Value</th>
              </tr>
            </thead>
            <tbody>
              <TableRow label="Price" value={renderPrice(item)} />
              <TableRow label="Delivery Area" value={deliveryType[item.delivery.type].area} />
              <TableRow label="Delivery Type" value={deliveryType[item.delivery.type].type} />
              {item.delivery.type !== "Door Pickup" && (
                <TableRow label="Delivery Cost" value={renderDeliveryCost(item.delivery.cost)} />
              )}
              <TableRow
                label="Sold By"
                value={
                  <Link className="flex gap-2" href={`/lists/${item.seller}`}>
                    <span className={`font-[600] text-gray-800 flex items-center gap-1 hover:text-red-500 cursor-pointer`}>
                      {item.seller_name}
                      <Icon icon="ic:round-link" width={24} height={24} />
                    </span>
                  </Link>
                }
              />
              <TableRow label="Condition" value={item.condition} />
              <TableRow label="Category" value={item.category} />
              <TableRow label="Location" value={item.my_location} />
              <TableRow
                label="Posted"
                value={ConvertDateToDaysAgo(new Date(item.created_at))}
              />
            </tbody>
          </table>
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <span className={`font-bold`}>Description: </span>
              <br />
              <span className={`font-[500] text-gray-600`}>
                {item.description}
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr className="mx-2" />

      {/* related items */}
      <div className="max-w-screen-xl mx-auto mt-[30px]">
        <h1 className="text-2xl font-bold mx-4">You Might Also Like</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
          {
            related.map((item, index) => (
              <Link key={index} href={`/item/${item._id}`}>
                <div className="flex flex-col rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg h-full">
                  <div className="relative">
                    <Image
                      src={"https://wsrv.nl?url=" + item.images[0] + "&w=200&h=200&fit=cover&a=attention"}
                      alt={item.name}
                      className="h-full w-full object-cover hover:scale-105 transition-all duration-300"
                      height={200}
                      width={200}
                    />
                  </div>
                  <div className="p-4">
                    <h1 className="text-xl font-bold">{item.name}</h1>
                    <span className="text-gray-600">{item.category}</span>
                    <div className="flex items-center gap-2 mt-2">
                      {renderPrice(item)}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </>
  )
}