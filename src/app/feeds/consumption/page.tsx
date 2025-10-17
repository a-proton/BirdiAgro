import DailyConsumptionCards from "./_components/DailyConsumptionCards";
import FeedConsumptionTable from "./_components/FeedConsumptionTable";
import AddConsumptionModal from "./_components/AddConsumptionModal";

export default function FeedConsumptionPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          दाना खपत
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
