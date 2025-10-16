"use client";

import { FileText, Download, Trash2, Calendar, Plus } from "lucide-react";
import { useState } from "react";

type Report = {
  id: string;
  title: string;
  type: "Sales" | "Expenses" | "Summary";
  generatedAt: string; // ISO date string
  period: string; // e.g., "Oct 1–15, 2025"
  status: "Completed" | "Processing";
};

export default function ReportsPage() {
  // Mock existing reports - replace with real data fetching
  const [reports, setReports] = useState<Report[]>([
    {
      id: "rep-001",
      title: "Monthly Sales Report",
      type: "Sales",
      generatedAt: "2025-10-15T10:30:00",
      period: "Oct 1–15, 2025",
      status: "Completed",
    },
    {
      id: "rep-002",
      title: "Weekly Expense Summary",
      type: "Expenses",
      generatedAt: "2025-10-10T14:20:00",
      period: "Oct 1–7, 2025",
      status: "Completed",
    },
  ]);

  // Generate report form state
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    type: "Summary" as "Sales" | "Expenses" | "Summary",
    startDate: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate API call delay
    setTimeout(() => {
      const newReport: Report = {
        id: `rep-${Date.now()}`,
        title: `${reportConfig.type} Report`,
        type: reportConfig.type,
        generatedAt: new Date().toISOString(),
        period: `${formatDate(reportConfig.startDate)} – ${formatDate(
          reportConfig.endDate
        )}`,
        status: "Completed",
      };
      setReports([newReport, ...reports]);
      setIsGenerating(false);
      // Reset form
      setReportConfig({
        type: "Summary",
        startDate: new Date(new Date().setDate(new Date().getDate() - 7))
          .toISOString()
          .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      });
    }, 1500);
  };

  const handleDownload = (id: string) => {
    alert(`Downloading report ${id}... (Implement PDF/API download)`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this report?")) {
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  // Helper to format date as "Oct 15"
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Reports
        </h1>
        <p className="text-gray-600 mt-1">
          Generate and manage financial reports
        </p>
      </div>

      {/* Generate Report Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#1ab189]" />
          <h2 className="text-lg font-semibold text-gray-900">
            Generate New Report
          </h2>
        </div>

        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={reportConfig.type}
                onChange={(e) =>
                  setReportConfig({
                    ...reportConfig,
                    type: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ab189]"
              >
                <option value="Summary">Summary</option>
                <option value="Sales">Sales</option>
                <option value="Expenses">Expenses</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={reportConfig.startDate}
                  onChange={(e) =>
                    setReportConfig({
                      ...reportConfig,
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
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={reportConfig.endDate}
                  onChange={(e) =>
                    setReportConfig({
                      ...reportConfig,
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
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1ab189] text-white rounded-lg hover:bg-[#158f6f] transition-colors disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </form>
      </div>

      {/* Existing Reports List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Generated Reports
          </h2>
        </div>
        <div className="overflow-x-auto">
          {reports.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No reports generated yet. Create your first report above.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
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
                        {report.type} Report
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          report.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(report.id)}
                          className="p-1.5 text-gray-500 hover:text-[#1ab189] rounded hover:bg-gray-100"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1.5 text-gray-500 hover:text-red-500 rounded hover:bg-gray-100"
                          title="Delete"
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
