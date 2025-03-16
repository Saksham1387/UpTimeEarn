"use client";
import React, { useState } from "react";
import { Plus,Activity } from "lucide-react";
import { useWebsites } from "@/hooks/useWebsites";
import { CreateWebsiteModal } from "@/components/CreateWebsiteModal";
import { WebsiteCard } from "@/components/WebsiteCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { websites, isLoading } = useWebsites();

  // Toggle dark mode
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black transition-colors duration-200">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">

          <Link href="/">

          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-emerald-400" />

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Uptime Monitor
            </h1>
          </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 text-black rounded-lg bg-gray-200 transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add Website</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                Loading websites...
              </p>
            </div>
          ) : websites && websites.length > 0 ? (
            websites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No websites added yet. Click "Add Website" to start monitoring.
              </p>
            </div>
          )}
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
