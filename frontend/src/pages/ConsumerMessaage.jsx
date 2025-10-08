import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ConsumerSidebar from "./ConsumerSidebar";
import { MessageSquare } from "lucide-react";

export default function ConsumerMessage() {
  const [activeTab, setActiveTab] = useState("Messages");

  // Placeholder message data
  const [messages] = useState([]);

  return (
    <DashboardLayout sidebar={<ConsumerSidebar activeTab={activeTab} />}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Messages</h2>
        <p className="text-gray-600 mt-2">
          Communicate with farmers and administrators
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500">
            Start a conversation with farmers or wait for responses to your
            requests
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Message list will go here when implemented */}
        </div>
      )}
    </DashboardLayout>
  );
}
