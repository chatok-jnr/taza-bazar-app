import React, { useState } from "react";
import ConsumerSidebar from "./ConsumerSidebar";

const ChatList = ({ chats }) => (
  <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200">
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-xl font-bold">Chats</h2>
    </div>
    <div className="overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center p-4 cursor-pointer hover:bg-gray-100 transition"
        >
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-4 flex-grow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{chat.name}</h3>
              <p className="text-xs text-gray-500">{chat.time}</p>
            </div>
            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function ConsumerMessage() {
  const [activeTab, setActiveTab] = useState("Messages");
  const chats = [
    {
      id: 1,
      name: "Green Farm",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      lastMessage: "Your order has been confirmed",
      time: "10:30 AM",
      online: true,
    },
    {
      id: 2,
      name: "Fresh Harvest Farm",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
      lastMessage: "We'll deliver your vegetables tomorrow",
      time: "Yesterday",
      online: false,
    },
    {
      id: 3,
      name: "Organic Valley",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
      lastMessage: "Thank you for your order!",
      time: "9/28/25",
      online: true,
    },
  ];

  const messages = [
    { id: 1, text: "Hi there!", timestamp: "10:30 AM", sender: "them" },
    {
      id: 2,
      text: "Hello! I'm interested in your products",
      timestamp: "10:31 AM",
      sender: "me",
    },
    {
      id: 3,
      text: "What would you like to know?",
      timestamp: "10:32 AM",
      sender: "them",
    },
    {
      id: 4,
      text: "Do you have fresh organic vegetables?",
      timestamp: "10:33 AM",
      sender: "me",
    },
    {
      id: 5,
      text: "Yes, we have organic tomatoes, cucumbers, and lettuce",
      timestamp: "10:34 AM",
      sender: "them",
    },
    {
      id: 6,
      text: "Great! How much are the tomatoes?",
      timestamp: "10:35 AM",
      sender: "me",
    },
    {
      id: 7,
      text: "They are $3 per pound",
      timestamp: "10:36 AM",
      sender: "them",
    },
    {
      id: 8,
      text: "Perfect, I'll take 5 pounds",
      timestamp: "10:37 AM",
      sender: "me",
    },
  ];

  return (
    <div className="flex h-screen font-sans antialiased text-gray-800 bg-gray-50">
      <ConsumerSidebar activeTab="Messages" />
      <ChatList chats={chats} />

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              alt="Green Farm"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Green Farm</h3>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === "me"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "me"
                        ? "text-blue-200"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex items-center">
            <button className="p-2 text-gray-500 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 mx-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
