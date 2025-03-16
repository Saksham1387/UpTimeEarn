import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export type Tick = {
  id: string;
  status: "GOOD" | "DOWN" | "UNKNOWN";
  createdAt: string;
};

type Website = {
  id: string;
  url: string;
  ticks: Tick[];
};

export function StatusCircle({ status }: { status: string }) {
  return (
    <div
      className={`w-3 h-3 rounded-full ${
        status === "GOOD"
          ? "bg-green-500"
          : status === "UNKNOWN"
            ? "bg-gray-500"
            : "bg-red-500"
      }`}
    />
  );
}

export function aggregateTicksToWindows(ticks: Tick[]): number[] {
  // Return empty array with 10 elements (all 'unknown' status) if no ticks exist
  if (!ticks || ticks.length === 0) {
    return Array(10).fill(-1); // -1 represents unknown status
  }

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
      // Return -1 for no data, 0 for down, 1 for up
      return windowTicks.length > 0
        ? windowTicks.every((tick) => tick.status === "GOOD")
          ? 1
          : 0
        : -1; // No data in this window
    })
    .reverse();

  return windows;
}

export function calculateUptimePercentage(ticks: Tick[]): number {
  if (!ticks || ticks.length === 0) return 0;

  const upTicks = ticks.filter((tick) => tick.status === "GOOD").length;
  return Math.round((upTicks / ticks.length) * 100 * 10) / 10;
}

export function getLastCheckTime(ticks: Tick[]): string {
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

export function UptimeTicks({ ticks }: { ticks: number[] }) {
  return (
    <div className="flex gap-1 mt-2">
      {ticks.map((tick, index) => (
        <div
          key={index}
          className={`w-8 h-3 rounded ${
            tick === 1
              ? "bg-green-500"
              : tick === 0
                ? "bg-red-500"
                : "bg-gray-300 dark:bg-gray-600"
          }`}
          title={tick === 1 ? "Up" : tick === 0 ? "Down" : "No data"}
        />
      ))}
    </div>
  );
}

export function WebsiteCard({ website }: { website: Website }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const aggregatedTicks = aggregateTicksToWindows(website.ticks);
  const uptimePercentage = calculateUptimePercentage(website.ticks);

  const lastChecked = getLastCheckTime(website.ticks);
  const currentStatus =
    website.ticks && website.ticks.length > 0
      ? website.ticks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0].status
      : "UNKNOWN";

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
            {website.ticks && website.ticks.length > 0
              ? `${uptimePercentage}% uptime`
              : "No data available"}
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
            {website.ticks && website.ticks.length > 0 ? (
              <UptimeTicks ticks={aggregatedTicks} />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                No monitoring data available yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
