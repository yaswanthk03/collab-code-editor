import React from "react";
import { useUser } from "../context/user.context";
import chat from "../assets/chatExapmle.json";

const ChatView = () => {
  const { user } = useUser();

  const personalChat = (chatMessages) => {
    return (
      <div className="messageGroup right mb-4 flex items-end justify-end space-x-3">
        <div className="flex flex-col">
          {chatMessages.map((chatMessage, index) => (
            <div
              key={index}
              className="messageContent bg-red-500 text-white p-3 rounded-lg shadow-md max-w-60 mb-1"
            >
              <p className="text-sm">
                {chatMessage.message}{" "}
                <span className="text-xs text-gray-400 block mt-1">
                  {chatMessage.time}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="avatar w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      </div>
    );
  };

  const groupChat = (chatMessages, userName) => {
    return (
      <div className="messageGroup left mb-4 flex items-start space-x-3">
        <div className="avatar w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div>
          <p className="text-xs text-gray-500 mb-1">{userName}</p>
          {chatMessages.map((chatMessage, index) => (
            <div
              key={index}
              className="messageContent bg-gray-100 p-3 rounded-lg shadow-md max-w-60 mb-1"
            >
              <p className="text-sm text-gray-800">{chatMessage.message}</p>
              <span className="text-xs text-gray-400 block mt-1">
                {chatMessage.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChat = () => {
    const groupedMessages = [];
    let currentGroup = [];

    chat.forEach((chatMessage, index) => {
      if (
        currentGroup.length === 0 ||
        currentGroup[0].user === chatMessage.user
      ) {
        currentGroup.push(chatMessage);
      } else {
        groupedMessages.push(currentGroup);
        currentGroup = [chatMessage];
      }

      if (index === chat.length - 1) {
        groupedMessages.push(currentGroup);
      }
    });

    return groupedMessages.map((group, index) => {
      const isPersonal = group[0].user === "Bob"; // Replace "Bob" with the logged-in user's identifier
      return isPersonal ? personalChat(group) : groupChat(group, group[0].user);
    });
  };

  return (
    <div className="chatArea flex-grow p-4 overflow-y-auto">
      

    {renderChat()}</div>
  );
};

export default ChatView;
