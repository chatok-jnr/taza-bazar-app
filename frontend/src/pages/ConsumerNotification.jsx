import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ConsumerSidebar from "./ConsumerSidebar";
import { Bell } from "lucide-react";

export default function ConsumerNotification() {
  const [activeTab, setActiveTab] = useState("Notifications");

  // Placeholder notifications data
  const [notifications] = useState([]);

  return (
    <DashboardLayout sidebar={<ConsumerSidebar activeTab={activeTab} />}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
        <p className="text-gray-600 mt-2">
          Stay updated with your requests and offers
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No notifications
          </h3>
          <p className="text-gray-500">
            We'll notify you when there are updates to your requests or new
            offers
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Notifications list will go here when implemented */}
        </div>
      )}
    </DashboardLayout>
  );
}
