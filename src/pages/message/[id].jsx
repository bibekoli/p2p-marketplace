import Image from "next/image";
import { useEffect, useState } from "react";
import Head from "next/head";
import Swal from "sweetalert2";
import "@/styles/globals.css";
import io from "socket.io-client";
import Router from "next/router";
import { Icon } from "@iconify/react";
let socket;

const ChatBubble = ({ name, type, message }) => {
  const colors = {
    received: {
      chat: "bg-green-500",
      avatar: "bg-green-900",
    },
    sent: {
      chat: "bg-blue-500",
      avatar: "bg-blue-900",
    },
  };

  return (
    <div className={`chat ${type === "received" ? "chat-start" : "chat-end"}`}>
      <div className="chat-image avatar">
        <div className={`w-10 rounded-full ${colors[type].avatar} text-white flex items-center justify-center`}>
          <span className="text-2xl font-bold flex items-center justify-center h-full">{name[0]}</span>
        </div>
      </div>
      <div className={`chat-bubble rounded-xl ${colors[type].chat}`}>{message}</div>
    </div>
  );
};

export default function ChatCLient({ chats }) {
  const [messages, setmessages] = useState(() => {
    const currentUserId = chats[0].currentUser[0]._id;
    const messages = chats[0].messages.map(message => {
      return {
        ...message,
        type: message.sender === currentUserId ? "sent" : "received",
        name: chats[0].users.find(user => user._id === message.sender).name,
      };
    });
    return messages.reverse();
  });

  useEffect(() => {
    socketInitializer();

    return () => {
      socket.disconnect();
    };

    //eslint-disable-next-line
  }, []);

  async function socketInitializer() {
    await fetch("/api/socket");
    socket = io();

    socket.on("receive-message", (data) => {
      if (data.sender !== currentUserId && data.chatId === chats[0]._id) {
        data.type = "received";
        data.name = chats[0].users.find(user => user._id === data.sender).name;
        setmessages((pre) => [data, ...pre]);
      }
    });
  }

  const currentUserId = chats[0].currentUser[0]._id;
  const  title = chats[0].users.find(user => user._id !== currentUserId).name + " - " + chats[0].itemInfo[0].name;
  const sendMessage = async (event) => {
    event.preventDefault();

    const message = event.target[0].value;
    // if message is space or empty, return
    if (!message.trim()) return;

    const payload = {
      _id: "",
      chatId: chats[0]._id,
      sender: currentUserId,
      message: message.trim(),
      createdAt: new Date(),
    };

    event.target[0].value = "";

    const res = await fetch("/api/chats/newMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (json.error) {
      Swal.fire({
        title: "Error",
        text: json.error,
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
      })
      
    }
    else {
      socket.emit("send-message", {
        ...payload,
        type: "received",
        name: chats[0].users.find(user => user._id !== currentUserId).name,
      });

      payload._id = json._id;
      payload.type = "sent";
      payload.name = chats[0].users.find(user => user._id === currentUserId).name;
      delete payload.chatId;
      setmessages([payload, ...messages]);
    }
  };

  return (
    <>
    <Head>
      <style>
      </style>
      <title>{title}</title>
    </Head>
    <div className="max-w-screen-xl mx-auto bg-white">
      {/* show sender name on top */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          {/* back button */}
          <button onClick={() => Router.push("/inbox")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M3.283 10.94a1.5 1.5 0 0 0 0 2.12l5.656 5.658a1.5 1.5 0 1 0 2.122-2.122L7.965 13.5H19.5a1.5 1.5 0 0 0 0-3H7.965l3.096-3.096a1.5 1.5 0 1 0-2.122-2.121L3.283 10.94Z"/></g></svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <span className="text-2xl font-bold flex items-center justify-center">
              <Image src={"https://wsrv.nl?url=" + chats[0].itemInfo[0].images[0] + "&w=32&h=32&fit=cover&a=attention"} width={32} height={32} className="rounded-full" alt="item image" />
            </span>
          </div>
          <div>
            {/* show sender name . product name */}
            <h4 className="text-lg font-semibold flex items-center gap-1">
              {chats[0].users.map(user => user._id !== currentUserId && user.name )}
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" d="M9.875 7.5a2.375 2.375 0 1 1-4.75 0a2.375 2.375 0 0 1 4.75 0Z"/></svg>
              {chats[0].itemInfo[0].name}
            </h4>
          </div>
        </div>
        {/* home button */}
        <button onClick={() => Router.push("/")}>
          <Icon icon="ant-design:home-filled" width="24" height="24" className="text-blue-500" />
        </button>
      </div>

      <div className="flex flex-col-reverse justify-between gap-3" style={{ height: "calc(100vh - 170px)" }}>
        <div className="flex flex-col-reverse gap-3 px-4 pt-4 mb-auto overflow-y-auto" style={{ maxHeight: "calc(100vh - 170px)" }}>
          {messages.map((message, index) => (
            <ChatBubble key={index} name={message.name} type={message.type} message={message.message} />
          ))}
        </div>
    
        <form className="flex items-center gap-3 mt-auto fixed bottom-0 max-w-screen-xl w-full p-4 xl:px-0 bg-white" onSubmit={sendMessage}>
          <input type="text" className="input input-bordered focus:outline-none rounded-lg w-full" placeholder="Type a message..." autoFocus />
          <button type="submit" className="btn btn-primary rounded-lg">Send</button>
        </form>
      </div>
    </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/chats/get?id=" + id, {
      method: "GET",
      headers: {
        Cookie: context.req.headers.cookie,
      },
    });
    const json = await res.json();
    if (json.error) {
      return {
        redirect: {
          destination: "/inbox",
          permanent: false,
        },
      };
    }
    return {
      props: {
        chats: json,
      },
    };
  }
  catch(e) {
    return {
      redirect: {
        destination: "/inbox",
        permanent: false,
      },
    };
  }
}