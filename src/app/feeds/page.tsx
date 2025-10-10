import FeedInventoryCards from "@/components/feeds/FeedInventoryCards";
import FeedInventoryTable from "@/components/feeds/FeedInventoryTable";
import AddFeedModal from "@/components/feeds/AddFeedModal";

export default function FeedsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Feed Management
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
