import PoultryManagementTable from "./_components/PoultryManagementTable";

export default function PoultryPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Kukhura Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your poultry birds and flocks
        </p>
      </div>

      {/* Table Component */}
      <PoultryManagementTable />
    </div>
  );
}
