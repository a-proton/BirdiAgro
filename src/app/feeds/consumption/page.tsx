import DailyConsumptionCards from "./_components/DailyConsumptionCards";
import FeedConsumptionTable from "./_components/FeedConsumptionTable";
import AddConsumptionModal from "./_components/AddConsumptionModal";

export default function FeedConsumptionPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
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
