import React from "react";
import Image from "next/image";

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
              {buckets} ({sacks} × 4)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>किलोग्राम:</span>
            <span className="font-medium text-gray-900">
              {kgs} किलो ({sacks} × 50)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const feedData = [
  {
    title: "B0",
    quantity: 25,
    sacks: 25,
    buckets: 100,
    kgs: 1250,
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-300",
    iconColor: "text-blue-600",
    iconSrc: "/icons/chicks.png",
    iconAlt: "चिक दाना आइकन",
  },
  {
    title: "B1",
    quantity: 25,
    sacks: 25,
    buckets: 100,
    kgs: 1250,
    bgColor: "bg-green-50",
    iconBg: "bg-green-300",
    iconColor: "text-green-600",
    iconSrc: "/icons/chicken-growing.png",
    iconAlt: "हिन्दी दाना आइकन",
  },
  {
    title: "B2",
    quantity: 25,
    sacks: 25,
    buckets: 100,
    kgs: 1250,
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-300",
    iconColor: "text-amber-600",
    iconSrc: "/icons/chicken-grown.png",
    iconAlt: "मुर्गा दाना आइकन",
  },
];

export default function FeedInventoryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {feedData.map((feed) => (
        <FeedCard key={feed.title} {...feed} />
      ))}
    </div>
  );
}
