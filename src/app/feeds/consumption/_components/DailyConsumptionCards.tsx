"use client";

import type React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getFeedStockSummary } from "@/lib/api/consumption";

interface ConsumptionCardProps {
  title: string;
  dailyConsumption: number;
  unit: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

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

function ConsumptionCard({
  title,
  dailyConsumption,
  unit,
  bgColor,
  iconBg,
  iconColor,
  icon,
}: ConsumptionCardProps) {
  const buckets = (dailyConsumption / 12.5).toFixed(1);

  return (
    <div
      className={`${bgColor} rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-gray-900">{title}</span>
        <div
          className={`w-12 h-12 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-1">दैनिक खपत</div>
        <div className="text-3xl font-bold text-gray-900">
          {dailyConsumption.toFixed(1)} {unit}
        </div>
        <div className="text-sm text-gray-500 mt-2">({buckets} बाल्टिनहरू)</div>
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
    icon: <FeedIcon src="/icons/chicks.png" alt="Starter Feed" />,
  },
  B1: {
    title: "B1 - ग्रोअर",
    bgColor: "bg-green-50",
    iconBg: "bg-green-300",
    iconColor: "text-green-600",
    icon: <FeedIcon src="/icons/chicken-growing.png" alt="Grower Feed" />,
  },
  B2: {
    title: "B2 - लेयर",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-300",
    iconColor: "text-amber-600",
    icon: <FeedIcon src="/icons/chicken-grown.png" alt="Layer Feed" />,
  },
};

export default function DailyConsumptionCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consumptionData, setConsumptionData] = useState<
    Array<{
      feedType: string;
      dailyConsumption: number;
    }>
  >([]);

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  const fetchConsumptionData = async () => {
    try {
      setLoading(true);
      const summary = await getFeedStockSummary();

      const processedData = summary.map((item) => ({
        feedType: item.feedType,
        dailyConsumption: item.dailyConsumption,
      }));

      setConsumptionData(processedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching consumption data:", err);
      setError("खपत जानकारी लोड गर्न असफल भयो।");
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
          onClick={fetchConsumptionData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          फेरि प्रयास गर्नुहोस्
        </button>
      </div>
    );
  }

  if (consumptionData.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">कुनै खपत जानकारी उपलब्ध छैन।</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {consumptionData.map((consumption) => {
        const config =
          feedTypeConfig[consumption.feedType as keyof typeof feedTypeConfig];
        if (!config) return null;

        return (
          <ConsumptionCard
            key={consumption.feedType}
            title={config.title}
            dailyConsumption={consumption.dailyConsumption}
            unit="kg"
            bgColor={config.bgColor}
            iconBg={config.iconBg}
            iconColor={config.iconColor}
            icon={config.icon}
          />
        );
      })}
    </div>
  );
}
