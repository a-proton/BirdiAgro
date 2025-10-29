"use client";
import { useState, useEffect } from "react";
import ViewFeedModal from "./ViewFeedModal";
import EditFeedModal from "./EditFeedModal";
import { getAllFeedRecords, deleteFeedRecord } from "@/lib/api/feed";
import { Trash2, Eye, Edit } from "lucide-react";

export interface FeedRecord {
  id: number;
  feedName: string;
  feedType: string;
  quantity: string;
  dateOfOrder: string;
  price: string;
  supplier: string;
  modeOfPayment: string;
  paymentProofName: string;
  paymentProofPath: string;
}

export default function FeedInventoryTable() {
  const [feedRecords, setFeedRecords] = useState<FeedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeed, setSelectedFeed] = useState<FeedRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchFeedRecords = async () => {
    try {
      setLoading(true);
      const records = await getAllFeedRecords();
      setFeedRecords(records);
      setError(null);
    } catch (err) {
      console.error("Error fetching feed records:", err);
      setError("दाना सूची लोड गर्न असफल भयो।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedRecords();
  }, []);

  const handleView = (feed: FeedRecord) => {
    setSelectedFeed(feed);
    setIsViewModalOpen(true);
  };

  const handleEdit = (feed: FeedRecord) => {
    setSelectedFeed(feed);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("के तपाईं यो दाना रेकर्ड मेट्न निश्चित हुनुहुन्छ?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteFeedRecord(id);
      await fetchFeedRecords();
    } catch (err) {
      console.error("Error deleting feed record:", err);
      alert("दाना रेकर्ड मेट्न असफल भयो।");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = () => {
    fetchFeedRecords();
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ab189]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <div className="text-center">
          <p className="text-sm sm:text-base text-red-600">{error}</p>
          <button
            onClick={fetchFeedRecords}
            className="mt-4 px-4 py-2 text-sm sm:text-base bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors"
          >
            फेरि प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            दाना सूची रेकर्डहरू
          </h2>
        </div>

        {feedRecords.length === 0 ? (
          <div className="px-4 sm:px-6 py-8 text-center text-sm sm:text-base text-gray-500">
            कुनै दाना रेकर्ड फेला परेन।
          </div>
        ) : (
          <>
            {/* Desktop Table View - Horizontally Scrollable */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      क्र.सं
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      दानाको नाम
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      दाना प्रकार
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      मात्रा
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      अर्डर मिति
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      मूल्य
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      वितरक
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      कार्यहरू
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {feedRecords.map((feed, index) => (
                    <tr
                      key={feed.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feed.feedName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {feed.feedType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {feed.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {feed.dateOfOrder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {feed.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {feed.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(feed)}
                            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="विवरण हेर्नुहोस्"
                          >
                            हेर्नुहोस्
                          </button>
                          <button
                            onClick={() => handleEdit(feed)}
                            className="px-3 py-1 text-[#1ab189] hover:bg-[#e8f8f7] rounded-lg transition-colors"
                            title="सम्पादन गर्नुहोस्"
                          >
                            सम्पादन
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {feedRecords.map((feed, index) => (
                <div key={feed.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {feed.feedType}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {feed.feedName}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs sm:text-sm text-gray-600 mb-3">
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">मात्रा:</span>
                      <span className="font-medium text-gray-900 text-right">
                        {feed.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">मिति:</span>
                      <span className="font-medium text-gray-900">
                        {feed.dateOfOrder}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">मूल्य:</span>
                      <span className="font-medium text-gray-900">
                        {feed.price}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">वितरक:</span>
                      <span className="font-medium text-gray-900 text-right truncate">
                        {feed.supplier}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(feed)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      हेर्नुहोस्
                    </button>
                    <button
                      onClick={() => handleEdit(feed)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm text-[#1ab189] bg-[#e8f8f7] hover:bg-[#d0f0eb] rounded-lg transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      सम्पादन
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedFeed && (
        <>
          <ViewFeedModal
            feed={selectedFeed}
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
          />
          <EditFeedModal
            feed={selectedFeed}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </>
  );
}
