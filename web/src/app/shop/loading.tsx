export default function ShopLoading() {
    return (
      <div className="py-6 animate-pulse">
        <div className="h-6 w-44 bg-gray-200 rounded" />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-60 bg-gray-100 rounded-xl border" />
          ))}
        </div>
      </div>
    );
  }