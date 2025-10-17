"use client";

import type React from "react";
import Image from "next/image";
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
      height={20}
      width={20}
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
          {dailyConsumption} {unit}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          ({(dailyConsumption / 12.5).toFixed(1)} बाल्टिनहरू)
        </div>
      </div>
    </div>
  );
}

const consumptionData = [
  {
    title: "B0 - स्टार्टर",
    dailyConsumption: 25,
    unit: "kg",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-300",
    iconColor: "text-blue-600",
    icon: <FeedIcon src="/icons/chicks.png" alt="Starter Feed" />,
  },
  {
    title: "B1 - ग्रोअरr",
    dailyConsumption: 45,
    unit: "kg",
    bgColor: "bg-green-50",
    iconBg: "bg-green-300",
    iconColor: "text-green-600",
    icon: <FeedIcon src="/icons/chicken-growing.png" alt="Grower Feed" />,
  },
  {
    title: "B2 - लेयर",
    dailyConsumption: 60,
    unit: "kg",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-300",
    iconColor: "text-amber-600",
    icon: <FeedIcon src="/icons/chicken-grown.png" alt="Layer Feed" />,
  },
];

export default function DailyConsumptionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {consumptionData.map((consumption) => (
        <ConsumptionCard key={consumption.title} {...consumption} />
      ))}
    </div>
  );
}
