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
    feedName: "स्टार्टर प्रिमियम मिक्स",
    feedType: "B0",
    quantity: "10 बोरा (500 kg)",
    dateOfOrder: "2024-10-01",
    price: "Rs 45,000",
    supplier: "नेपाल फिड्स प्रा. लि.",
    modeOfPayment: "Bank Transfer",
    paymentProof: "receipt_001.pdf",
  },
  {
    id: 2,
    feedName: "ग्रोअर कम्प्लीट फिड",
    feedType: "B1",
    quantity: "15 बोरा (750 kg)",
    dateOfOrder: "2024-10-03",
    price: "Rs 63,000",
    supplier: "हिमालयन एग्रो",
    modeOfPayment: "Cash",
    paymentProof: "receipt_002.pdf",
  },
  {
    id: 3,
    feedName: "लेयर अप्टिमम",
    feedType: "B2",
    quantity: "12 बोरा (600 kg)",
    dateOfOrder: "2024-10-05",
    price: "Rs 57,600",
    supplier: "नेपाल फिड्स प्रा. लि.",
    modeOfPayment: "Cheque",
    paymentProof: "receipt_003.pdf",
  },
  {
    id: 4,
    feedName: "ब्रोइलर स्टार्टर",
    feedType: "B0",
    quantity: "8 बोरा (400 kg)",
    dateOfOrder: "2024-10-06",
    price: "Rs 36,000",
    supplier: "पोखरा फिड इन्डस्ट्रीज",
    modeOfPayment: "Bank Transfer",
    paymentProof: "receipt_004.pdf",
  },
  {
    id: 5,
    feedName: "फिनिशर प्रो",
    feedType: "B1",
    quantity: "20 बोरा (1000 kg)",
    dateOfOrder: "2024-10-08",
    price: "Rs 82,000",
    supplier: "हिमालयन एग्रो",
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
            दाना सूची रेकर्डहरू
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
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
                  भुक्तानी प्रकार
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  भुक्तानी प्रमाण
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
                        title="विवरण हेर्नुहोस्"
                      >
                        हेर्नुहोस्
                      </button>
                      <button
                        onClick={() => handleEdit(feed)}
                        className="p-2 text-[#1ab189] hover:bg-[#e8f8f7] rounded-lg transition-colors"
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
