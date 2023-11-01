import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { ConvertDateToDaysAgo } from "@/modules/utilities";

async function getChatList() {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/chats/getList", {
      method: "GET",
      headers: {
        Cookie: cookies().toString(),
      },
      cache: "no-store",
    });
    const json = await res.json();
    return json;
  }
  catch(e) {
    return {};
  }
}

export default async function MessageList() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const chatList = await getChatList();
  if (!chatList || chatList.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto mt-[80px]">
        {/* empty inbox */}
        <div className="m-4 p-4 rounded-lg flex flex-col items-center justify-center h-[calc(80vh-80px)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 28 28"><path fill="currentColor" d="M14 3.5C8.201 3.5 3.5 8.201 3.5 14c0 1.884.496 3.65 1.363 5.178a.75.75 0 0 1 .07.575l-1.318 4.634l4.634-1.318a.75.75 0 0 1 .576.07A10.449 10.449 0 0 0 14 24.5c5.799 0 10.5-4.701 10.5-10.5S19.799 3.5 14 3.5ZM2 14C2 7.373 7.373 2 14 2s12 5.373 12 12s-5.373 12-12 12a11.95 11.95 0 0 1-5.637-1.404l-4.77 1.357a1.25 1.25 0 0 1-1.544-1.544l1.356-4.77A11.95 11.95 0 0 1 2 14Z"/></svg>
          <div className="text-lg font-bold mt-4">No messages in your inbox</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto mt-[80px] flex flex-col gap-4">
      <div className="px-4 mt-2">
        <div className="text-xl font-bold">My Messages</div>
      </div>
      {
        chatList.reverse().map((chat, index) => {
          return (
            <Link className="bg-base-200 p-4 mx-4 rounded-lg flex items-center gap-2 justify-between" key={index} href={"/message/" + chat._id}>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-base-300 mr-4">
                  <Image src={chat.itemInfo.images[0]} alt={chat.itemInfo.name} width={48} height={48} className="rounded-full" />
                </div>
                <div className="flex flex-col">
                  <div className="font-bold">
                    {
                      chat.users.map((user, index) => {
                        if (user.name !== session.user.name) {
                          return user.name;
                        }
                        else {
                          return "";
                        }
                      })
                    }
                  </div>
                  <div className="text-sm text-base-content-secondary">
                    { chat.messages[0].sender._id === chat.me[0]._id ? "You: " : ""}
                    {chat.messages[0].message}
                  </div>
                </div>
              </div>
              <div className="text-sm text-base-content-secondary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48H40a16 16 0 0 0-16 16v160a15.84 15.84 0 0 0 9.25 14.5A16.05 16.05 0 0 0 40 240a15.89 15.89 0 0 0 10.25-3.78a.69.69 0 0 0 .13-.11L82.5 208H216a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16ZM40 224Zm176-32H82.5a16 16 0 0 0-10.3 3.75l-.12.11L40 224V64h176Z"/></svg>
                {ConvertDateToDaysAgo(new Date(chat.messages[0].createdAt))}
              </div>
            </Link>
          );
        })
      }
    </div>
  );
}