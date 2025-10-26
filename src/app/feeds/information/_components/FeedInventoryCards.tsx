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
  quantity: number;
  sacks: number;
  buckets: number;
  kgs: number;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  iconSrc: string;
  iconAlt: string;
}

function FeedCard({
  title,
  quantity,
  sacks,
  buckets,
  kgs,
  bgColor,
  iconBg,
  iconColor,
  iconSrc,
  iconAlt,
}: FeedCardProps) {
  return (
    <div
      className={`${bgColor} rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-gray-900">{title}</span>
        <div
          className={`w-12 h-12 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}
        >
          <FeedIcon src={iconSrc} alt={iconAlt} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900 mb-3">
          मात्रा: {quantity} बोरा
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>बाल्टिनहरू:</span>
            <span className="font-medium text-gray-900">
              {buckets.toFixed(1)} ({sacks} × 4)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>किलोग्राम:</span>
            <span className="font-medium text-gray-900">
              {kgs.toFixed(0)} किलो ({sacks} × 50)
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
      quantity: number;
      sacks: number;
      buckets: number;
      kgs: number;
    }>
  >([]);

  useEffect(() => {
    fetchFeedInventory();
  }, []);

  const fetchFeedInventory = async () => {
    try {
      setLoading(true);
      const summary = await getFeedStockSummary();

      const processedData = summary.map((item) => {
        const kgs = item.quantityKg;
        const sacks = Math.round(kgs / 50);
        const buckets = item.quantityBuckets;

        return {
          feedType: item.feedType,
          quantity: sacks,
          sacks: sacks,
          buckets: buckets,
          kgs: kgs,
        };
      });

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
            className="bg-gray-100 rounded-lg h-48 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchFeedInventory}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          फेरि प्रयास गर्नुहोस्
        </button>
      </div>
    );
  }

  if (feedData.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">कुनै दाना स्टक जानकारी उपलब्ध छैन।</p>
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
            quantity={feed.quantity}
            sacks={feed.sacks}
            buckets={feed.buckets}
            kgs={feed.kgs}
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
