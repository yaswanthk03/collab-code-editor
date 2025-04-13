import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../config/axios";
import ChatView from "../components/chatView";
import AddUsersToProject from "../components/addUsersToProject";
import { useSocket } from "../hooks/websocket";
import { useUser } from "../context/user.context";
import FileTreeArea from "../components/FileTreeArea";

const Project = () => {
  const location = useLocation();

  const [project, setProject] = useState(location.state);
  const [membersOpen, setMembersOpen] = useState(false);
  const socket = useSocket(project._id);
  const { user } = useUser();

  const [newChatMessage, setNewChatMessage] = useState();

  const handleSendMessage = () => {
    if (newChatMessage) {
      console.log("Sending message:", user);
      socket.send(
        JSON.stringify({
          type: "message",
          userId: user.userId,
          message: newChatMessage,
        })
      );
      setNewChatMessage("");
      const newElement = `
        <div class="flex flex-col">
            <div
              class="messageContent bg-red-500 text-white p-3 rounded-lg shadow-md max-w-60 mb-1"
            >
              <p class="text-sm">
                ${newChatMessage}${" "}
                <span class="text-xs text-gray-400 block mt-1">
                  ${new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>
        </div>
        <div class="avatar w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      `;
      const chatArea = document.querySelector(".chatArea");
      const chatContainer = document.createElement("div");

      chatContainer.className =
        "messageGroup right mb-4 flex items-end justify-end space-x-3";

      chatContainer.innerHTML = newElement;

      chatArea.appendChild(chatContainer);
      chatArea.scrollTop = chatArea.scrollHeight; // Scroll to the bottom
    }
  };

  useEffect(() => {
    try {
      axiosInstance.get(`/projects/${project._id}`).then((res) => {
        console.log(res.data);
        setProject(res.data);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.message === "Ping") return;
        const newElement = `
          <div class="messageGroup left mb-4 flex items-start space-x-3">
        <div class="avatar w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div>
          <p class="text-xs text-gray-500 mb-1">${message.userId}</p>
          <div class="messageContent bg-gray-100 p-3 rounded-lg shadow-md max-w-60 mb-1">
            <p class="text-sm text-gray-800">${message.message}</p>
            <span class="text-xs text-gray-400 block mt-1">${"10:00 AM"}</span>
          </div>
        </div>
          </div>
        `;
        const chatArea = document.querySelector(".chatArea");
        const chatContainer = document.createElement("div");

        chatContainer.innerHTML = newElement;
        chatArea.appendChild(chatContainer);
        chatArea.scrollTop = chatArea.scrollHeight; // Scroll to the bottom
      };
    }
  }, [socket]);
  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }
  }, [socket]);

  return (
    <div className="h-screen w-screen bg-gray-100 flex">
      {/* Members List */}
      <div
        className={`members w-[30%] h-full absolute left-0 bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out ${
          membersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {membersOpen && (
          <div className="membersList flex flex-col h-full">
            <div className="membersListHeader h-12 bg-gray-200 flex items-center justify-between px-4 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800">Members</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-300"
                onClick={() => setMembersOpen(!membersOpen)}
              >
                <i className="ri-close-line text-gray-800 text-xl"></i>
              </button>
            </div>

            <div className="membersListArea flex-grow overflow-y-auto p-4">
              {project.users.map((user) => (
                <div
                  key={user._id}
                  className="member py-2 px-4 bg-gray-100 rounded-lg mb-2 shadow-sm hover:bg-gray-200"
                >
                  {user.username}
                </div>
              ))}
            </div>
            <AddUsersToProject project={project} setProject={setProject} />
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="chat w-[30%] h-full bg-gray-50 flex flex-col">
        <div className="chatHeader h-12 bg-gray-200 flex items-center justify-between px-4 shadow-md">
          <h1 className="text-lg font-semibold text-gray-800">
            {project.name}
          </h1>
          <button
            className="p-2 rounded-full hover:bg-gray-300"
            onClick={() => setMembersOpen(!membersOpen)}
          >
            <i className="ri-group-line text-gray-800 text-xl"></i>
          </button>
        </div>
        <ChatView className="chatView" />
        <div className="chatInput h-12 bg-gray-200 flex items-center px-4">
          <form
            className="flex items-center w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              value={newChatMessage}
              onChange={(e) => setNewChatMessage(e.target.value)}
              placeholder="Type a message..."
              className="h-10 flex-grow px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              className="ml-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              onClick={handleSendMessage}
            >
              <i className="ri-send-plane-line text-lg"></i>
            </button>
          </form>
        </div>
      </div>

      {/* Project Area */}
      <FileTreeArea />
    </div>
  );
};

export default Project;
