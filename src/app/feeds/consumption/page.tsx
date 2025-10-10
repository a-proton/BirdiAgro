import DailyConsumptionCards from "@/components/feeds/consumption/DailyConsumptionCards";
import FeedConsumptionTable from "@/components/feeds/consumption/FeedConsumptionTable";
import AddConsumptionModal from "@/components/feeds/consumption/AddConsumptionModal";

export default function FeedConsumptionPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Feed Consumption
        </h1>
        <AddConsumptionModal />
      </div>

      {/* Daily Consumption Cards */}
      <DailyConsumptionCards />

      {/* Feed Consumption Table */}
      <FeedConsumptionTable />
    </div>
  );
}
