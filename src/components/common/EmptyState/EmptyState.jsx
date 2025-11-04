export default function EmptyState({ title = "Không có dữ liệu", description }) {
  return (
    <div className="flex flex-col items-center text-center py-10 text-gray-500">
      <img src="/assets/images/empty.png" alt="empty" className="w-32 mb-4 opacity-70" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}
