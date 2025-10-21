"use client";

import {
  FileText,
  Download,
  Trash2,
  Calendar,
  Plus,
  Layers,
} from "lucide-react";
import { useState } from "react";

type ReportType = "Sales" | "Expenses" | "Summary";
type Report = {
  id: string;
  title: string;
  type: ReportType;
  generatedAt: string;
  period: string;
  status: "Completed" | "Processing";
  batchName: string;
};

const REPORT_TYPE_OPTIONS: { value: ReportType | "All"; label: string }[] = [
  { value: "All", label: "सबै" },
  { value: "Sales", label: "बिक्री" },
  { value: "Expenses", label: "खर्च" },
  { value: "Summary", label: "सारांश" },
];

const getTypesFromSelection = (selection: ReportType | "All"): ReportType[] => {
  if (selection === "All") {
    return ["Sales", "Expenses", "Summary"];
  }
  return [selection];
};

const generateBatchName = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timePart = now.toTimeString().slice(0, 5).replace(/:/g, "");
  return `ब्याच-${datePart}-${timePart}`;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "rep-001",
      title: "मासिक बिक्री रिपोर्ट",
      type: "Sales",
      generatedAt: "2025-10-15T10:30:00",
      period: "अक्टोबर 1–15, 2025",
      status: "Completed",
      batchName: "rep-001",
    },
    {
      id: "rep-002",
      title: "साप्ताहिक खर्च सारांश",
      type: "Expenses",
      generatedAt: "2025-10-10T14:20:00",
      period: "अक्टोबर 1–7, 2025",
      status: "Completed",
      batchName: "rep-002",
    },
  ]);

  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  const [reportConfig, setReportConfig] = useState({
    type: "Summary" as ReportType,
    startDate: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [batchConfig, setBatchConfig] = useState({
    selection: "All" as ReportType | "All",
    batchName: "", // ← NEW: optional custom batch name
    startDate: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // Single report: each is its own batch
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingSingle(true);

    setTimeout(() => {
      const batchName = `rep-${Date.now()}`;
      const newReport: Report = {
        id: batchName,
        title: `${reportConfig.type} रिपोर्ट`,
        type: reportConfig.type,
        generatedAt: new Date().toISOString(),
        period: `${formatDate(reportConfig.startDate)} – ${formatDate(
          reportConfig.endDate
        )}`,
        status: "Completed",
        batchName, // self-contained batch
      };
      setReports([newReport, ...reports]);
      setIsGeneratingSingle(false);

      setReportConfig({
        type: "Summary",
        startDate: new Date(new Date().setDate(new Date().getDate() - 7))
          .toISOString()
          .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      });
    }, 1500);
  };

  // Batch report: all share same batchName
  const handleGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingBatch(true);

    setTimeout(() => {
      const finalBatchName =
        batchConfig.batchName.trim() || generateBatchName();
      const batchName = `batch-${Date.now()}`;
      const typesToGenerate = getTypesFromSelection(batchConfig.selection);
      const newReports: Report[] = typesToGenerate.map((type) => ({
        id: `rep-${Date.now()}-${type}`,
        title: `${type} रिपोर्ट`,
        type,
        generatedAt: new Date().toISOString(),
        period: `${formatDate(batchConfig.startDate)} – ${formatDate(
          batchConfig.endDate
        )}`,
        status: "Completed",
        batchName,
      }));

      setReports([...newReports, ...reports]);
      setIsGeneratingBatch(false);

      setBatchConfig({
        selection: "All",
        batchName: "",
        startDate: new Date(new Date().setDate(new Date().getDate() - 7))
          .toISOString()
          .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      });
    }, 1500);
  };

  const handleDownload = (id: string) => {
    alert(`रिपोर्ट ${id} डाउनलोड हुँदैछ...`);
  };

  const handleDelete = (id: string) => {
    if (confirm("के तपाईं यो रिपोर्ट मेटाउन चाहनुहुन्छ?")) {
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Sales":
        return "बिक्री";
      case "Expenses":
        return "खर्च";
      case "Summary":
        return "सारांश";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* पेज हेडर */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          रिपोर्टहरू
        </h1>
        <p className="text-gray-600 mt-1">
          वित्तीय रिपोर्टहरू सिर्जना गर्नुहोस् र व्यवस्थापन गर्नुहोस्
        </p>
      </div>

      {/* ब्याच रिपोर्ट सिर्जना कार्ड */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-[#1ab189]" />
          <h2 className="text-lg font-semibold text-gray-900">
            ब्याच रिपोर्ट सिर्जना गर्नुहोस्
          </h2>
        </div>

        <form onSubmit={handleGenerateBatch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ब्याच नाम
              </label>
              <select
                name="feedType"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189] focus:border-transparent"
              >
                <option value="">ब्याच चयन गर्नुहोस्</option>
                <option value="B0">B0 - स्टार्टर</option>
                <option value="B1">B1 - ग्रोअर</option>
                <option value="B2">B2 - लेयर</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                रिपोर्ट प्रकार
              </label>
              <select
                value={batchConfig.selection}
                onChange={(e) =>
                  setBatchConfig({
                    ...batchConfig,
                    selection: e.target.value as ReportType | "All",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
              >
                {REPORT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                सुरु मिति
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={batchConfig.startDate}
                  onChange={(e) =>
                    setBatchConfig({
                      ...batchConfig,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                />
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                अन्तिम मिति
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={batchConfig.endDate}
                  onChange={(e) =>
                    setBatchConfig({
                      ...batchConfig,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
                />
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGeneratingBatch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors disabled:opacity-70"
          >
            {isGeneratingBatch ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ब्याच सिर्जना हुँदैछ...
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                ब्याच रिपोर्ट सिर्जना गर्नुहोस्
              </>
            )}
          </button>
        </form>
      </div>

      {/* सिर्जना भएका रिपोर्टहरू */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            सिर्जना भएका रिपोर्टहरू
          </h2>
        </div>
        <div className="overflow-x-auto">
          {reports.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              अहिलेसम्म कुनै रिपोर्ट सिर्जना भएको छैन।
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    रिपोर्ट
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    ब्याच
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    अवधिः
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    सिर्जना मिति
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    स्थिति
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    क्रियाकलाप
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {report.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getTypeLabel(report.type)} रिपोर्ट
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.batchName.startsWith("batch-")
                        ? report.batchName.replace("batch-", "").slice(0, 12) // shorten for display
                        : "एकल"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(report.generatedAt).toLocaleDateString("ne-NP")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          report.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status === "Completed"
                          ? "पूरा भयो"
                          : "प्रक्रियामा"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(report.id)}
                          className="p-1.5 text-gray-500 hover:text-[#1ab189] rounded hover:bg-gray-100"
                          title="डाउनलोड"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1.5 text-gray-500 hover:text-red-500 rounded hover:bg-gray-100"
                          title="मेटाउन"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
