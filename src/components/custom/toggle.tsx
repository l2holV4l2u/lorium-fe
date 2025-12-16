export function Toggle({
  label,
  data,
  setData,
}: {
  label: string;
  data: boolean;
  setData: (d: boolean) => void;
}) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-1 font-semibold text-gray-800">{label}</div>
      <div
        onClick={() => setData(!data)}
        className={`w-12 h-6 flex items-center ${
          data ? "bg-primary-300" : "bg-gray-300"
        } rounded-full p-1 cursor-pointer transition-colors duration-200`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transition-all duration-200 ${
            data ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}
