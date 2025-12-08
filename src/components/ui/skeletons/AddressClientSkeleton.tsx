export const AddressClientSkeleton = () => {
  return (
    <div className="flex flex-col items-center p-5 gap-10">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        {/* Delivery option skeleton */}
        <div className="rounded-xl p-5 mb-4 bg animate-pulse">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="bg-gray-600 rounded h-6 w-1/3 mb-2" />
              <div className="bg-gray-600 rounded h-4 w-3/4 mb-2" />
              <div className="bg-gray-600 rounded h-4 w-1/2 mb-2" />
              <div className="bg-gray-600 rounded h-4 w-1/4 mt-3" />
            </div>
            <div className="bg-gray-600 rounded h-5 w-20" />
          </div>
        </div>

        {/* Pickup option skeleton */}
        <div className="rounded-xl p-5 bg animate-pulse">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="bg-gray-600 rounded h-6 w-1/3 mb-2" />
              <div className="bg-gray-600 rounded h-4 w-2/3 mb-2" />
              <div className="bg-gray-600 rounded h-4 w-1/2 mb-2" />
              <div className="bg-gray-600 rounded h-4 w-1/4 mt-3" />
            </div>
            <div className="bg-gray-600 rounded h-5 w-12" />
          </div>
        </div>

      </div>

      {/* Continue button skeleton */}
      <div className="bg rounded h-12 w-48 animate-pulse" />
    </div>
  );
};
