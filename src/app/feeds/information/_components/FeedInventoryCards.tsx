// ===== FeedInventoryCards.tsx =====
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getFeedStockSummary } from "@/lib/api/consumption";

interface FeedIconProps {
  src: string;
  alt: string;
}

function FeedIcon({ src, alt }: FeedIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      height={32}
      width={32}
      className="w-8 h-8 object-contain"
    />
  );
}

interface FeedCardProps {
  title: string;
  quantitySacks: number;
  quantityBuckets: number;
  quantityKg: number;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  iconSrc: string;
  iconAlt: string;
}

function FeedCard({
  title,
  quantitySacks,
  quantityBuckets,
  quantityKg,
  bgColor,
  iconBg,
  iconColor,
  iconSrc,
  iconAlt,
}: FeedCardProps) {
  return (
    <div
      className={`${bgColor} rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-100`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <span className="text-base sm:text-lg font-bold text-gray-900">
          {title}
        </span>
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}
        >
          <FeedIcon src={iconSrc} alt={iconAlt} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
          स्टक: {quantitySacks.toFixed(1)} बोरा
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center justify-between gap-2">
            <span>बाल्टिनहरू:</span>
            <span className="font-medium text-gray-900 text-right">
              {quantityBuckets.toFixed(1)} ({(quantitySacks * 4).toFixed(1)}{" "}
              बाल्टिन)
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>किलोग्राम:</span>
            <span className="font-medium text-gray-900 text-right">
              {quantityKg.toFixed(0)} किलो ({(quantitySacks * 50).toFixed(0)}{" "}
              किलो)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const feedTypeConfig = {
  B0: {
    title: "B0 - स्टार्टर",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-300",
    iconColor: "text-blue-600",
    iconSrc: "/icons/chicks.png",
    iconAlt: "चिक दाना आइकन",
  },
  B1: {
    title: "B1 - ग्रोअर",
    bgColor: "bg-green-50",
    iconBg: "bg-green-300",
    iconColor: "text-green-600",
    iconSrc: "/icons/chicken-growing.png",
    iconAlt: "हिन्दी दाना आइकन",
  },
  B2: {
    title: "B2 - लेयर",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-300",
    iconColor: "text-amber-600",
    iconSrc: "/icons/chicken-grown.png",
    iconAlt: "मुर्गा दाना आइकन",
  },
};

export default function FeedInventoryCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedData, setFeedData] = useState<
    Array<{
      feedType: string;
      quantitySacks: number;
      quantityBuckets: number;
      quantityKg: number;
    }>
  >([]);

  useEffect(() => {
    fetchFeedInventory();
  }, []);

  const fetchFeedInventory = async () => {
    try {
      setLoading(true);
      const summary = await getFeedStockSummary();

      const processedData = summary.map((item) => ({
        feedType: item.feedType,
        quantitySacks: item.quantitySacks,
        quantityBuckets: item.quantityBuckets,
        quantityKg: item.quantityKg,
      }));

      setFeedData(processedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching feed inventory:", err);
      setError("दाना स्टक जानकारी लोड गर्न असफल भयो।");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg h-40 sm:h-48 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
        <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchFeedInventory}
          className="px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          फेरि प्रयास गर्नुहोस्
        </button>
      </div>
    );
  }

  if (feedData.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
        <p className="text-sm sm:text-base text-gray-600">
          कुनै दाना स्टक जानकारी उपलब्ध छैन।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {feedData.map((feed) => {
        const config =
          feedTypeConfig[feed.feedType as keyof typeof feedTypeConfig];
        if (!config) return null;

        return (
          <FeedCard
            key={feed.feedType}
            title={config.title}
            quantitySacks={feed.quantitySacks}
            quantityBuckets={feed.quantityBuckets}
            quantityKg={feed.quantityKg}
            bgColor={config.bgColor}
            iconBg={config.iconBg}
            iconColor={config.iconColor}
            iconSrc={config.iconSrc}
            iconAlt={config.iconAlt}
          />
        );
      })}
    </div>
  );
}
