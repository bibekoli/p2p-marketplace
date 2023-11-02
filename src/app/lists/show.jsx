"use client";

import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

export default function MyItemList({ items, title, owner}) {
  const status = {
    available: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2Zm3.535 6.381l-4.95 4.95l-2.12-2.121a1 1 0 0 0-1.415 1.414l2.758 2.758a1.1 1.1 0 0 0 1.556 0l5.586-5.586a1 1 0 0 0-1.415-1.415Z"/></g></svg>,
    sold: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16"><path fill="currentColor" d="M2.343 13.657A8 8 0 1 1 13.658 2.343A8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018a.751.751 0 0 0-.018 1.042L6.94 8L4.97 9.97a.749.749 0 0 0 .326 1.275a.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326a.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275a.749.749 0 0 0-.734.215L8 6.94Z"/></svg>
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
                      रु. {item.price.amount} <span className={`text-xs ${ item.status === "sold" ? "text-red-500" : "text-green-500" }`}>{ item.status === "sold" ? status.sold : status.available}</span>
                    </div>
                  </div>
                </div>
                {/* edit and delete button */}
                <div className="flex flex-col items-end">
                  <div className="flex gap-2">
                    <Link href={"/edit/" + item._id} hidden={owner !== "me"}>
                      <button className="btn p-2 btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621Z"/><path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3"/></g></svg>
                      </button>
                    </Link>
                    <Link href={"/item/" + item._id}>
                      <button className="btn p-2 btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="currentColor"/><path fill="currentColor" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68ZM16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5Z"/></svg>
                      </button>
                    </Link>
                    <button className="btn p-2 btn-circle" style={{ display: owner === "me" ? "inline-block" : "none", display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => deleteItem(item._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></svg>
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