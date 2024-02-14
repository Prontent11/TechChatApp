import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [username, setUsername] = useState("");
  const history = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleStartChat = () => {
    if (username.trim() !== "") {
      localStorage.setItem("username", username);
      history("/chat");
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleStartChat();
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full w-full prose">
        <h1 className="text-4xl font-bold mb-4">Welcome to TechChat</h1>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
          onKeyDown={handleKeyPress}
          className="p-2 border mb-4"
        />
        <button
          onClick={handleStartChat}
          className="bg-blue-500 px-4 py-2 rounded-md text-white"
        >
          Start Chat
        </button>
      </div>
    </>
  );
};

export default HomePage;
