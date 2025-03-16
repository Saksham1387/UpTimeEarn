"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Globe, Plus, Moon, Sun } from "lucide-react";
import { useWebsites } from "@/hooks/useWebsites";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { BACKEND_URL } from "@/config";

function StatusCircle({ status }: { status: string }) {
  return (
    <div
      className={`w-3 h-3 rounded-full ${status === "up" ? "bg-green-500" : "bg-red-500"}`}
    />
  );
}

function aggregateTicksToWindows(ticks: any[]) {
  if (!ticks || ticks.length === 0) return [];

  // Sort ticks by creation date
  const sortedTicks = [...ticks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Get the latest tick's time
  const latestTime = new Date(
    sortedTicks[sortedTicks.length - 1].createdAt
  ).getTime();

  // Create 10 three-minute windows
  const windows = Array(10)
    .fill(null)
    .map((_, i) => {
      const windowEnd = latestTime - i * 3 * 60 * 1000;
      const windowStart = windowEnd - 3 * 60 * 1000;

      const windowTicks = sortedTicks.filter((tick) => {
        const tickTime = new Date(tick.createdAt).getTime();
        return tickTime > windowStart && tickTime <= windowEnd;
      });

      // If any tick in the window is down, the window is considered down
      return windowTicks.length > 0
        ? windowTicks.every((tick) => tick.status === "up")
          ? 1
          : 0
        : 1; // Default to up if no ticks in window
    })
    .reverse();

  return windows;
}

function calculateUptimePercentage(ticks: any[]) {
  if (!ticks || ticks.length === 0) return 100;

  const upTicks = ticks.filter((tick) => tick.status === "up").length;
  return Math.round((upTicks / ticks.length) * 100 * 10) / 10;
}

function getLastCheckTime(ticks: any[]) {
  if (!ticks || ticks.length === 0) return "Never";

  const latestTick = [...ticks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const timeDiff = Date.now() - new Date(latestTick.createdAt).getTime();
  const minutes = Math.floor(timeDiff / (1000 * 60));

  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  return `${minutes} minutes ago`;
}

function UptimeTicks({ ticks }: { ticks: number[] }) {
  return (
    <div className="flex gap-1 mt-2">
      {ticks.map((tick, index) => (
        <div
          key={index}
          className={`w-8 h-3 rounded ${tick ? "bg-green-500" : "bg-red-500"}`}
        />
      ))}
    </div>
  );
}

function WebsiteCard({ website }: { website: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const aggregatedTicks = aggregateTicksToWindows(website.ticks);
  const uptimePercentage = calculateUptimePercentage(website.ticks);
  const lastChecked = getLastCheckTime(website.ticks);
  const currentStatus =
    website.ticks && website.ticks.length > 0
      ? website.ticks[website.ticks.length - 1].status
      : "up";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <StatusCircle status={currentStatus} />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {website.url}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {website.url}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {uptimePercentage}% uptime
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Last 30 minutes status
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Last checked: {lastChecked}
              </span>
            </div>
            <UptimeTicks ticks={aggregatedTicks} />
          </div>
        </div>
      )}
    </div>
  );
}

function CreateWebsiteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { getToken } = useAuth();

  const { getWebsites } = useWebsites();
  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = await getToken();
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/website`,
      {
        url,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    getWebsites();
    console.log(res);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Add New Website
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <input
                type="url"
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Add Website
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { websites, getWebsites } = useWebsites();
  console.log(websites)
  // Toggle dark mode
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Uptime Monitor
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add Website</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {websites?.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      </div>

      <CreateWebsiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
