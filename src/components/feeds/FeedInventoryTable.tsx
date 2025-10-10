"use client";
import { useState } from "react";
import ViewFeedModal from "./ViewFeedModal";
import EditFeedModal from "./EditFeedModal";

export interface FeedRecord {
  id: number;
  feedName: string;
  feedType: string;
  quantity: string;
  dateOfOrder: string;
  price: string;
  supplier: string;
  modeOfPayment: string;
  paymentProof: string;
}

const feedRecords: FeedRecord[] = [
  {
    id: 1,
    feedName: "Starter Premium Mix",
    feedType: "B0",
    quantity: "10 sacks (500 kg)",
    dateOfOrder: "2024-10-01",
    price: "Rs 45,000",
    supplier: "Nepal Feeds Pvt Ltd",
    modeOfPayment: "Bank Transfer",
    paymentProof: "receipt_001.pdf",
  },
  {
    id: 2,
    feedName: "Grower Complete Feed",
    feedType: "B1",
    quantity: "15 sacks (750 kg)",
    dateOfOrder: "2024-10-03",
    price: "Rs 63,000",
    supplier: "Himalayan Agro",
    modeOfPayment: "Cash",
    paymentProof: "receipt_002.pdf",
  },
  {
    id: 3,
    feedName: "Layer Optimum",
    feedType: "B2",
    quantity: "12 sacks (600 kg)",
    dateOfOrder: "2024-10-05",
    price: "Rs 57,600",
    supplier: "Nepal Feeds Pvt Ltd",
    modeOfPayment: "Cheque",
    paymentProof: "receipt_003.pdf",
  },
  {
    id: 4,
    feedName: "Broiler Starter",
    feedType: "B0",
    quantity: "8 sacks (400 kg)",
    dateOfOrder: "2024-10-06",
    price: "Rs 36,000",
    supplier: "Pokhara Feed Industries",
    modeOfPayment: "Bank Transfer",
    paymentProof: "receipt_004.pdf",
  },
  {
    id: 5,
    feedName: "Finisher Pro",
    feedType: "B1",
    quantity: "20 sacks (1000 kg)",
    dateOfOrder: "2024-10-08",
    price: "Rs 82,000",
    supplier: "Himalayan Agro",
    modeOfPayment: "Online Payment",
    paymentProof: "receipt_005.pdf",
  },
];

export default function FeedInventoryTable() {
  const [selectedFeed, setSelectedFeed] = useState<FeedRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleView = (feed: FeedRecord) => {
    setSelectedFeed(feed);
    setIsViewModalOpen(true);
  };

  const handleEdit = (feed: FeedRecord) => {
    setSelectedFeed(feed);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Feed Inventory Records
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  SN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Feed Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Feed Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date of Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Mode of Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Payment Proof
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
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
                    {feed.modeOfPayment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <a
                      href="#"
                      className="text-[#1ab189] hover:text-[#158f6f] hover:underline"
                    >
                      {feed.paymentProof}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(feed)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(feed)}
                        className="p-2 text-[#1ab189] hover:bg-[#e8f8f7] rounded-lg transition-colors"
                        title="Edit"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          />
        </>
      )}
    </>
  );
}
