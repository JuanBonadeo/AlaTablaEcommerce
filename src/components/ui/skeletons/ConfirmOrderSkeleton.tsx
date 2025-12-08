export const ConfirmOrderSkeleton = () => {
  return (
    <div className="flex justify-center items-center mb-20 px-2 lg:px-0">
      <div className="flex flex-col w-[1000px] gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          
          {/* Left: Cart skeleton */}
          <div className="bg rounded-xl shadow-xl p-6">
            <div className="bg-gray-600 rounded h-7 w-1/3 mb-4 animate-pulse" />
            <div className="bg-gray-600 rounded h-4 w-full mb-4 animate-pulse" />
            
            {/* Product items skeleton */}
            {[1, 2].map((i) => (
              <div key={i} className="flex mb-5">
                <div className="bg-gray-600 rounded mr-5 animate-pulse" style={{ width: '100px', height: '100px' }} />
                <div className="flex-1">
                  <div className="bg-gray-600 rounded h-5 w-3/4 mb-2 animate-pulse" />
                  <div className="bg-gray-600 rounded h-6 w-1/3 mb-2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Right: Address + Payment skeleton */}
          <div className="bg rounded-xl shadow-xl p-6">
            {/* Address section */}
            <div className="bg-gray-600 rounded h-7 w-2/3 mb-3 animate-pulse" />
            <div className="mb-4">
              <div className="bg-gray-600 rounded h-5 w-full mb-2 animate-pulse" />
              <div className="bg-gray-600 rounded h-4 w-3/4 mb-2 animate-pulse" />
              <div className="bg-gray-600 rounded h-4 w-1/2 animate-pulse" />
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-4" />

            {/* Summary section */}
            <div className="bg-gray-600 rounded h-7 w-1/2 mb-3 animate-pulse" />
            <div className="grid grid-cols-2 mb-4 gap-2">
              <div className="bg-gray-600 rounded h-5 w-3/4 animate-pulse" />
              <div className="bg-gray-600 rounded h-5 w-1/2 ml-auto animate-pulse" />
              <div className="bg-gray-600 rounded h-5 w-2/3 animate-pulse" />
              <div className="bg-gray-600 rounded h-5 w-1/3 ml-auto animate-pulse" />
              <div className="bg-gray-600 rounded h-5 w-1/2 animate-pulse" />
              <div className="bg-gray-600 rounded h-5 w-1/4 ml-auto animate-pulse" />
              <div className="bg-gray-600 rounded h-7 w-1/2 mt-5 animate-pulse" />
              <div className="bg-gray-600 rounded h-7 w-2/3 ml-auto mt-5 animate-pulse" />
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-4" />

            {/* Payment section */}
            <div className="bg-gray-600 rounded h-6 w-1/3 mb-2 animate-pulse" />
            <div className="flex flex-col gap-3 mb-4">
              <div className="bg-gray-600 rounded h-5 w-2/3 animate-pulse" />
              <div className="bg-gray-600 rounded h-5 w-2/3 animate-pulse" />
            </div>

            {/* Button */}
            <div className="flex justify-end">
              <div className="bg-gray-600 rounded h-12 w-48 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
