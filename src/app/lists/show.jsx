import Image from "next/image";
import Link from "next/link";

export default function MyItemList({ items, title, owner}) {
  return (
    <div className="max-w-screen-xl mx-auto mt-[80px] flex flex-col gap-4">
      <div className="px-4 mt-2">
        <div className="text-xl font-bold">{title}</div>
      </div>
      {
        items.reverse().map((item, index) => {
          return (
            <div key={index}>
              <div className="bg-base-100 p-4 mx-4 rounded-lg flex items-center gap-2 justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <Image src={"https://wsrv.nl?url=" + item.images[0] + "&w=64&h=64&fit=cover&a=attention"} width={64} height={64} alt="item image" />
                  </div>
                  <div className="flex flex-col ml-4">
                    <div className="text-lg font-bold">{item.name}</div>
                    <div className="text-sm">रु. {item.price.amount}</div>
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
                    <button className="btn p-2 btn-circle" style={{ display: owner === "me" ? "block" : "none" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"/></svg>
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