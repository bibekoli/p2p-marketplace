"use client";

import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";

export default function MyItemList({ items, title, owner}) {
  const status = {
    available: <Icon icon="mingcute:check-circle-fill" height="18" width="18" />,
    sold: <Icon icon="octicon:x-circle-fill-16" height="15" width="15" />
  }

  const deleteItem = id => {
    Swal.fire({
      title: "Delete Item",
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch("/api/DeleteAd", {
          method: "POST",
          body: JSON.stringify({ id })
        })
        .then((res) => res.json())
        .then((data) => {
          window.location.reload();
        })
        .catch((error) => {
          Swal.fire({
            title: "Error",
            text: error.response.data.error,
            icon: "error",
            confirmButtonText: "OK",
          });
        });
      }
    });
  }

  return (
    <div className="max-w-screen-xl mx-auto mt-[80px] flex flex-col gap-4">
      <div className="px-4 mt-2">
        <div className="text-xl font-bold">{title}</div>
      </div>
      {
        items.map((item, index) => {
          return (
            <div key={index}>
              <div className="bg-base-100 p-4 mx-4 rounded-lg flex items-center gap-2 justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <Image src={"https://wsrv.nl?url=" + item.images[0] + "&w=64&h=64&fit=cover&a=attention"} width={64} height={64} alt="item image" />
                  </div>
                  <div className="flex flex-col ml-4">
                    <div className="text-lg font-bold">{item.name}</div>
                    <div className="text-sm flex items-center gap-2">
                      रु. {item.price.amount.toLocaleString("ne-NP")} <span className={`text-xs ${ item.status === "sold" ? "text-red-500" : "text-green-500" }`}>{ item.status === "sold" ? status.sold : status.available}</span>
                    </div>
                  </div>
                </div>
                {/* edit and delete button */}
                <div className="flex flex-col items-end">
                  <div className="flex gap-2">
                    <Link href={"/edit/" + item._id} hidden={owner !== "me"}>
                      <button className="btn p-2 btn-circle">
                        <Icon icon="bx:edit" height="24" width="24" />
                      </button>
                    </Link>
                    <Link href={"/item/" + item._id}>
                      <button className="btn p-2 btn-circle">
                      <Icon icon="ion:eye" height="24" width="24" />
                      </button>
                    </Link>
                    <button className="btn p-2 btn-circle" style={{ display: owner === "me" ? "inline-block" : "none", display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => deleteItem(item._id)}>
                      <Icon icon="tabler:trash" height="24" width="24" />
                    </button>
                  </div>
                </div>
              </div>
              <hr className="mx-4" />
            </div>
          );
        })
      }
    </div>
  );
}