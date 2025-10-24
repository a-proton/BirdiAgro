import FeedInventoryCards from "./_components/FeedInventoryCards";
import FeedInventoryTable from "./_components/FeedInventoryTable";
import AddFeedModal from "./_components/AddFeedModal";

export default function FeedsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          दाना व्यवस्थापन
        </h1>
        <AddFeedModal />
      </div>

      {/* Feed Inventory Cards */}
      <FeedInventoryCards />

      {/* Feed Inventory Table */}
      <FeedInventoryTable />
    </div>
  );
}
