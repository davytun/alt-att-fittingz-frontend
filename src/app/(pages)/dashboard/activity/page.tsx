import { ActivityFeed } from "./activity-feed";

export const metadata = {
  title: "Recent Activity - Fittingz",
  description: "View all recent updates and activity",
};

export default function ActivityPage() {
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-[#222831]">Recent Activity</h1>
        <p className="text-sm text-gray-500 mt-1">
          View all recent updates and changes
        </p>
      </div>
      <ActivityFeed />
    </div>
  );
}
