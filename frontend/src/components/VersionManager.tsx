import React, { useState, useEffect } from "react";
import APIService from "../services/APIService";

export function VersionManager() {
  const [showRefreshPrompt, setShowRefreshPrompt] = useState(false);

  useEffect(() => {
    const handleVersionMismatch = () => {
      setShowRefreshPrompt(true);
    };

    window.addEventListener("apiVersionMismatch", handleVersionMismatch);

    // On component mount, check if API service already detected a mismatch
    if (APIService.hasVersionMismatch()) {
      setShowRefreshPrompt(true);
    }

    // Schedule regular version checks
    const versionCheckInterval = setInterval(() => {
      checkServerVersion();
    }, 60000);

    // Initial version check
    checkServerVersion();

    return () => {
      window.removeEventListener("apiVersionMismatch", handleVersionMismatch);
      clearInterval(versionCheckInterval);
    };
  }, []);

  const checkServerVersion = async () => {
    const response = await APIService.checkServerVersion();
    if (response.requiresRefresh) {
      setShowRefreshPrompt(true);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!showRefreshPrompt) {
    return null;
  }

  console.log(
    "VersionManager: Version mismatch detected. Please refresh the page."
  );
  return (
    <div
      data-version-mismatch
      className="fixed bottom-4 right-4 z-[9999] w-96 border border-gray-200 p-8 rounded-md shadow-lg"
      style={{
        backgroundColor: "white",
        padding: "4rem",
      }}
    >
      <h2 className="text-xl font-bold mb-2">New Version Available</h2>
      <p className="text-gray-700 mb-4">
        The application has been updated.
        <br />
        Go to <code>frontend/src/services/APIService.ts:L15</code> to see the
        latest version.
      </p>
      <h4 className="mb-4">
        Please manually change to match backend service: <strong>1.0.0</strong>
      </h4>

      {/* 
        Uncomment if you want a button to force a refresh or do something else:
        
        <div className="flex justify-end">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            Update Now
          </button>
        </div>
      */}
    </div>
  );
}
