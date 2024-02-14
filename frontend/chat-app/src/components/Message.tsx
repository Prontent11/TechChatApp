// Message.tsx
import React from "react";

interface MessageProps {
  sender: string;
  content: string;
  color: string;
}

const Message: React.FC<MessageProps> = ({ sender, content, color }) => {
  return (
    <div
      className={`max-w-fit ${
        sender === "You" ? "ml-auto" : "mr-auto"
      } message ${color} p-3 rounded-md`}
    >
      <p className="font-semibold">{sender}</p>
      <p>{content}</p>
    </div>
  );
};

export default Message;
