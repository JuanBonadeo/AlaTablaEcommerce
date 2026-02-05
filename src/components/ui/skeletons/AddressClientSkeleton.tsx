export const AddressClientSkeleton = () => {
  return (
    <div className="flex flex-col items-center p-5 gap-10">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Delivery option skeleton */}
        <div className="rounded-xl p-6 bg-[#171718] border border-gray-800 animate-pulse">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="bg-[#4e4e4e] rounded h-7 w-1/3 mb-3" />
              <div className="bg-[#4e4e4e] rounded h-4 w-3/4 mb-2" />
              <div className="bg-[#4e4e4e] rounded h-4 w-1/2 mb-2" />
              <div className="bg-[#4e4e4e] rounded h-4 w-1/4 mt-4" />
            </div>
            <div className="bg-[#4e4e4e] rounded h-5 w-20" />
          </div>
        </div>

        {/* Pickup option skeleton */}
        <div className="rounded-xl p-6 bg-[#171718] border border-gray-800 animate-pulse">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="bg-[#4e4e4e] rounded h-7 w-1/3 mb-3" />
              <div className="bg-[#4e4e4e] rounded h-4 w-2/3 mb-2" />
              <div className="bg-[#4e4e4e] rounded h-4 w-1/2 mb-2" />
            </div>
            <div className="bg-[#4e4e4e] rounded h-5 w-16" />
          </div>
        </div>

      </div>

      {/* Continue button skeleton */}
      <div className="bg-[#4e4e4e] rounded-xl h-14 w-full max-w-2xl animate-pulse" />
    </div>
  );
};
