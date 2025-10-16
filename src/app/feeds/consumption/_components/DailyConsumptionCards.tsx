"use client";

import type React from "react";

interface ConsumptionCardProps {
  title: string;
  dailyConsumption: number;
  unit: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

function StarterFeedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <path
        d="M12 3C10.5 3 9 4 8 5.5C7 7 6.5 9 6.5 11C6.5 13 7 15 8 16.5C9 18 10.5 19 12 19C13.5 19 15 18 16 16.5C17 15 17.5 13 17.5 11C17.5 9 17 7 16 5.5C15 4 13.5 3 12 3Z"
        fill="currentColor"
        opacity="0.3"
      />
      <circle cx="12" cy="8" r="2" fill="currentColor" />
      <path
        d="M10 11C10 11 10.5 13 12 13C13.5 13 14 11 14 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="12"
        cy="16"
        rx="3"
        ry="1.5"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

function GrowerFeedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <path
        d="M12 2C10 2 8 3.5 7 5.5C6 7.5 5.5 10 5.5 12.5C5.5 15 6 17.5 7 19.5C8 21.5 10 23 12 23C14 23 16 21.5 17 19.5C18 17.5 18.5 15 18.5 12.5C18.5 10 18 7.5 17 5.5C16 3.5 14 2 12 2Z"
        fill="currentColor"
        opacity="0.3"
      />
      <circle cx="12" cy="7" r="2.5" fill="currentColor" />
      <path
        d="M9 11C9 11 10 14 12 14C14 14 15 11 15 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 17C8 17 9 19 12 19C15 19 16 17 16 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="12"
        cy="20"
        rx="4"
        ry="1.5"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

function LayerFeedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <ellipse
        cx="12"
        cy="14"
        rx="6"
        ry="8"
        fill="currentColor"
        opacity="0.3"
      />
      <circle cx="12" cy="6" r="3" fill="currentColor" />
      <path
        d="M8 10C8 10 9 13 12 13C15 13 16 10 16 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="12"
        cy="18"
        rx="5"
        ry="3"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M7 18C7 18 8.5 21 12 21C15.5 21 17 18 17 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="15"
        cy="16"
        rx="2"
        ry="3"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
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
        <div className="text-sm text-gray-600 mb-1">Daily Consumption</div>
        <div className="text-3xl font-bold text-gray-900">
          {dailyConsumption} {unit}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          ({(dailyConsumption / 12.5).toFixed(1)} buckets)
        </div>
      </div>
    </div>
  );
}

const consumptionData = [
  {
    title: "B0 - Starter",
    dailyConsumption: 25,
    unit: "kg",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-300",
    iconColor: "text-blue-600",
    icon: <StarterFeedIcon />,
  },
  {
    title: "B1 - Grower",
    dailyConsumption: 45,
    unit: "kg",
    bgColor: "bg-green-50",
    iconBg: "bg-green-300",
    iconColor: "text-green-600",
    icon: <GrowerFeedIcon />,
  },
  {
    title: "B2 - Layer",
    dailyConsumption: 60,
    unit: "kg",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-300",
    iconColor: "text-amber-600",
    icon: <LayerFeedIcon />,
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
