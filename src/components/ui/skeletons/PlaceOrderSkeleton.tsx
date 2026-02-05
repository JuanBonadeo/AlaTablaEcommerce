export const PlaceOrderSkeleton = () => {
  return (
    <div className="bg-[#4e4e4e] rounded-xl shadow-xl p-7">
      {/* Title */}
      <div className="bg-[#4e4e4e] rounded h-7 w-2/3 mb-2 animate-pulse" />
      
      {/* Address info */}
      <div className="mb-10">
        <div className="bg-[#4e4e4e] rounded h-4 w-full mb-2 animate-pulse" />
        <div className="bg-[#4e4e4e] rounded h-4 w-3/4 animate-pulse" />
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      {/* Resumen title */}
      <div className="bg-[#4e4e4e] rounded h-7 w-1/2 mb-2 animate-pulse" />

      {/* Summary items */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#4e4e4e] rounded h-5 w-3/4 animate-pulse" />
        <div className="bg-[#4e4e4e] rounded h-5 w-1/2 ml-auto animate-pulse" />
        
        <div className="bg-[#4e4e4e] rounded h-5 w-2/3 animate-pulse" />
        <div className="bg-[#4e4e4e] rounded h-5 w-1/3 ml-auto animate-pulse" />
        
        <div className="bg-[#4e4e4e] rounded h-7 w-1/2 mt-5 animate-pulse" />
        <div className="bg-[#4e4e4e] rounded h-7 w-2/3 ml-auto mt-5 animate-pulse" />
      </div>

      {/* Disclaimer and button */}
      <div className="mt-5 mb-2 w-full">
        <div className="bg-[#4e4e4e] rounded h-3 w-full mb-2 animate-pulse" />
        <div className="bg-[#4e4e4e] rounded h-3 w-3/4 mb-5 animate-pulse" />
        
        {/* Button skeleton */}
        <div className="bg-[#4e4e4e] rounded h-12 w-full animate-pulse" />
      </div>
    </div>
  );
};
