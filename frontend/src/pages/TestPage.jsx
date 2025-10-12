import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-100 p-8">
      <h1 className="text-4xl font-bold text-red-800">TEST PAGE IS WORKING!</h1>
      <p className="text-xl text-red-600 mt-4">If you can see this, the routing and React are working properly.</p>
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Debug Info:</h2>
        <p>Current Time: {new Date().toLocaleString()}</p>
        <p>Page: Test Page</p>
        <p>Status: ✅ Working</p>
      </div>
    </div>
  );
}