export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-md overflow-hidden fade-in">
          {/* Image skeleton */}
          <div className="w-full bg-[#4e4e4e] rounded animate-pulse" style={{ paddingBottom: '100%' }} />
          
          <div className="p-4 flex flex-col gap-2">
            {/* Product name skeleton */}
            <div className="bg-[#4e4e4e] rounded h-5 w-3/4 animate-pulse" />
            
            {/* Price skeleton */}
            <div className="bg-[#4e4e4e] rounded h-6 w-1/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
