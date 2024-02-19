// ChatPage.tsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Message from "../components/Message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notificationSound from "../assets/notification.mp3";
interface MessageData {
  sender: string;
  content: string;
  color: string;
  socketId: string;
}

const socket = io(import.meta.env.VITE_SOCKET_API);

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [mySocketId, setMySocketId] = useState<string | null>(null);
  const [notification] = useState(new Audio(notificationSound));

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    setUsername(localStorage.getItem("username"));
    setMySocketId(socket.id!);

    socket.on("connect", () => {
      socket.emit("user joined");
      setMySocketId(socket.id!);
    });
    socket.emit("new-user", username);
    socket.on("new-user", (username) => {
      toast.success(username + " joined the chat", {
        className: "w-[340px] sm:w-full",
      });
      notification.play();
    });

    socket.on("user-disconnected", (username) => {
      toast.error(username + " left the chat", {
        className: "w-[340px] sm:w-full",
      });
      notification.play();
    });

    socket.on("message", (message: MessageData) => {
      if (document.hidden) {
        notification.play();
      }
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("new-user");
      socket.off("user-disconnected");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll the chat container to the bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const newMessage: MessageData = {
        sender: username || "Anonymous",
        content: inputMessage,
        color: "green-300",
        socketId: socket.id!,
      };
      socket.emit("message", newMessage);
      setInputMessage("");
    }
  };
  const handleBeforeUnload = () => {
    localStorage.removeItem("username");
    console.log("Username removed on page refresh.");
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };

  return (
    <div className="h-full w-full p-2 border ">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div
        className="chatContainer  p-3 h-[90%] w-full min-w-[300px] flex flex-col justify-start gap-6  overflow-y-auto"
        ref={chatContainerRef}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            sender={message.socketId === mySocketId ? "You" : message.sender}
            content={message.content}
            color={
              message.socketId === mySocketId ? "bg-green-400" : "bg-orange-200"
            }
          />
        ))}
      </div>
      <div className="inputContainer border-t p-3 flex   ">
        <input
          autoFocus
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className=" p-2 sm:text-xl text-md w-full min-w-10 outline-none"
          placeholder="Type here..."
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 px-3 py-2 rounded-md text-white border-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
