// ChatPage.tsx
import React, { useState, useEffect } from "react";
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

const socket = io("http://localhost:5000");

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
      toast.success(username + " joined the chat");
      notification.play();
    });

    socket.on("user-disconnected", (username) => {
      toast.error(username + " left the chat");
      notification.play();
    });

    socket.on("message", (message: MessageData) => {
      if (document.hidden) {
        notification.play();
      }
      console.log(mySocketId, message.socketId);
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
    // Remove the event listener to prevent it from triggering again
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };

  return (
    <div className="h-full w-full p-2 border">
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
      <div className="chatContainer p-3 h-[90%] w-full flex flex-col justify-start gap-6 overflow-y-auto">
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
      <div className="inputContainer border-t p-3 flex gap-10  ">
        <input
          autoFocus
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className=" p-2 text-xl w-full min-w-5 outline-none"
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
