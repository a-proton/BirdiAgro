"use client";

import { Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import AddSalesModal from "./_components/AddSalesModal";
import Image from "next/image";
interface StatIconProps {
  src: string;
  alt: string;
}

function StatIcon({ src, alt }: StatIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      height={20}
      width={20}
      className="w-6 h-6 object-contain"
    />
  );
}

export default function SalesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header  */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            बिक्री व्यवस्थापन
          </h1>
          <p className="text-gray-600 mt-1">
            आफ्नो बिक्री कारोबार ट्र्याक र व्यवस्थापन गर्नुहोस्
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          बिक्री थप्नुहोस्
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Today's Sales */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              आजको बिक्री
            </span>
            <div className="w-10 h-10 bg-[#e8f8f7] text-[#1ab189] rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/money-bag.png" alt="Money Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">रु 45,200</div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>हिजोको तुलनामा ८%</span>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              यस महिना
            </span>
            <div className="w-10 h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/trending.png" alt="Chart Up Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            रु १२.५ लाख
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>पछिल्लो महिनाको तुलनामा १५%</span>
          </div>
        </div>

        {/* Total Overall Sales */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              कुल बिक्री
            </span>
            <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center">
              <StatIcon src="/icons/total-sales.png" alt="Analytics Icon" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            रु २.४५ लाख
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>यस वर्षमा +२२%</span>
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">हालैको बिक्री</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  क्रम संख्या
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  ब्याच नाम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  उत्पादन
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  कुल रकम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  कुल किलोग्राम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  मिति
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  १
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ब्याच-००१
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ब्रॉइलर कुखुरा
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ५० कि.ग्रा
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  रु १५,०००
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  २०२४-०१-१५
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <AddSalesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
