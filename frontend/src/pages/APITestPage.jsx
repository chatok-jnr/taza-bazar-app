import React, { useState, useEffect } from "react";
import { API_BASE_URL, getApiUrl } from "../config/api";

export default function APITestPage() {
  const [status, setStatus] = useState("Testing...");
  const [apiUrl, setApiUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setApiUrl(API_BASE_URL);
    setStatus("Connecting to backend...");

    try {
      const response = await fetch(getApiUrl("api/v1/users"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setStatus("✅ Connected successfully!");
        setError("");
      } else {
        setStatus("⚠️ Backend responded but with an error");
        setError(`Status: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setStatus("❌ Connection failed");
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          API Connection Test
        </h1>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h2 className="font-semibold text-blue-900 mb-2">API Base URL:</h2>
            <code className="text-sm text-blue-700 break-all">{apiUrl}</code>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold text-gray-900 mb-2">
              Connection Status:
            </h2>
            <p className="text-lg">{status}</p>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded">
              <h2 className="font-semibold text-red-900 mb-2">
                Error Details:
              </h2>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={testConnection}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            Test Connection Again
          </button>

          <div className="mt-6 text-sm text-gray-600">
            <h3 className="font-semibold mb-2">Troubleshooting:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Make sure your backend is deployed and running on Render</li>
              <li>Check that CORS is properly configured in backend/app.js</li>
              <li>Verify the VITE_API_URL in your .env file</li>
              <li>Restart the dev server after changing .env</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
