import PoultryManagementTable from "./_components/PoultryManagementTable";

export default function PoultryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          कुखुरा व्यवस्थापन
        </h1>
        <p className="text-gray-600 mt-1">
          तपाईंका कुखुरा र ब्याचहरू व्यवस्थापन गर्नुहोस्
        </p>
      </div>

      <PoultryManagementTable />
    </div>
  );
}
