import { Egg, Bird, Drumstick, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  egg: Egg,
  bird: Bird,
  drumstick: Drumstick,
};

interface FeedCardProps {
  title: string;
  quantity: number;
  sacks: number;
  buckets: number;
  kgs: number;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  icon: string;
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
  icon,
}: FeedCardProps) {
  const IconComponent = iconMap[icon] || Egg;

  return (
    <div
      className={`${bgColor} rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-gray-900">{title}</span>
        <div
          className={`w-12 h-12 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}
        >
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900 mb-3">
          Quantity: {quantity} sacks
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Buckets:</span>
            <span className="font-medium text-gray-900">
              {buckets} ({sacks} × 4)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Kilograms:</span>
            <span className="font-medium text-gray-900">
              {kgs} kg ({sacks} × 50)
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
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: "egg",
  },
  {
    title: "B1",
    quantity: 25,
    sacks: 25,
    buckets: 100,
    kgs: 1250,
    bgColor: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    icon: "bird",
  },
  {
    title: "B2",
    quantity: 25,
    sacks: 25,
    buckets: 100,
    kgs: 1250,
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    icon: "drumstick",
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
