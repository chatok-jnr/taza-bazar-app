import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Calendar,
  ChevronRight,
  X,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useLocation } from "react-router-dom";
import FarmerSidebar from "./FarmerSidebar";
import ConsumerSidebar from "./ConsumerSidebar";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const { getToken, user } = useUser();
  const location = useLocation();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Prefer token from UserContext; fallback to stored key used across the app
        const token =
          (typeof getToken === "function" ? getToken() : null) ||
          localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("Please log in to view announcements");
        }

        const response = await fetch(
          "https://taza-bazar-backend.onrender.com/api/v1/farmer/announcement",
          {
            //const response = await fetch('http://127.0.0.1:8000/api/v1/farmer/announcement', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Session expired or unauthorized. Please log in again."
            );
          }
          throw new Error("Failed to fetch announcements");
        }

        const data = await response.json();
        setAnnouncements(data.allAnnouncement || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [getToken]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Determine which sidebar to show based on URL path
  const isFarmer = location.pathname.includes("/farmer/");
  const isConsumer = location.pathname.includes("/consumer/");

  if (loading) {
    return (
      <div className="flex">
        {isFarmer && <FarmerSidebar />}
        {isConsumer && <ConsumerSidebar />}
        <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        {isFarmer && <FarmerSidebar />}
        {isConsumer && <ConsumerSidebar />}
        <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Conditional Sidebar Rendering */}
      {isFarmer && <FarmerSidebar />}
      {isConsumer && <ConsumerSidebar />}

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Megaphone className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Announcements
              </h1>
            </div>
          </div>
        </header>

        {/* Announcements List */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {announcements.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-600">
                No announcements available at this time.
              </div>
            ) : (
              announcements.map((announcement) => (
                <motion.div
                  key={announcement._id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  <div className="p-6">
                    {/* Admin Name */}
                    <div className="flex items-center text-gray-800 mb-3">
                      <UserIcon className="h-5 w-5 mr-2 text-green-600" />
                      <span className="font-semibold text-lg">
                        {announcement.admin_id?.name || "Admin"}
                      </span>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(announcement.createdAt)}</span>
                      <Clock className="h-4 w-4 mr-2 ml-4" />
                      <span>{formatTime(announcement.createdAt)}</span>
                    </div>

                    {/* View Details Indicator */}
                    <div className="flex items-center text-green-600 text-sm font-medium mt-4">
                      <span>Click to view announcement</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </main>

        {/* Announcement Detail Modal */}
        <AnimatePresence>
          {selectedAnnouncement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedAnnouncement(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Megaphone className="h-6 w-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Announcement Details
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Admin Info */}
                  <div className="mb-4">
                    <div className="flex items-center text-gray-800 mb-2">
                      <UserIcon className="h-5 w-5 mr-2 text-green-600" />
                      <span className="font-semibold text-lg">
                        {selectedAnnouncement.admin_id?.name || "Admin"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(selectedAnnouncement.createdAt)}</span>
                      <Clock className="h-4 w-4 mr-2 ml-4" />
                      <span>{formatTime(selectedAnnouncement.createdAt)}</span>
                    </div>
                  </div>

                  {/* Announcement Message */}
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Message:
                    </h3>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedAnnouncement.announcement}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
