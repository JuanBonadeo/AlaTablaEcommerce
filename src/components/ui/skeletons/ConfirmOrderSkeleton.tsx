import { ConfirmOrderSkeleton } from './ConfirmOrderSkeleton';

const ConfirmOrderSkeletonComponent = () => {
  return (
    <div className="flex justify-center items-center mb-20 px-4 xl:px-0 py-8">
      <div className="flex flex-col w-full max-w-[1000px] gap-8">

        {/* Header skeleton */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-800">
          <div className="bg-gray-800 rounded-full h-8 w-8 animate-pulse" />
          <div>
            <div className="bg-gray-800 rounded h-6 w-48 mb-2 animate-pulse" />
            <div className="bg-gray-800 rounded h-4 w-64 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Cart skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
              <div className="bg-gray-800 rounded h-7 w-1/3 mb-6 animate-pulse" />

              {/* Product items skeleton */}
              {[1, 2].map((i) => (
                <div key={i} className="flex mb-5">
                  <div className="bg-gray-800 rounded mr-5 animate-pulse" style={{ width: '80px', height: '80px' }} />
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded h-5 w-3/4 mb-2 animate-pulse" />
                    <div className="bg-gray-800 rounded h-4 w-1/3 mb-2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
              <div className="bg-gray-800 rounded h-7 w-1/3 mb-4 animate-pulse" />
              <div className="bg-gray-800 rounded h-5 w-2/3 mb-2 animate-pulse" />
              <div className="bg-gray-800 rounded h-4 w-1/2 animate-pulse" />
            </div>
          </div>

          {/* Right: Address + Payment skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
              {/* Summary section */}
              <div className="bg-gray-800 rounded h-7 w-1/2 mb-6 animate-pulse" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <div className="bg-gray-800 rounded h-5 w-1/3 animate-pulse" />
                  <div className="bg-gray-800 rounded h-5 w-1/4 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="bg-gray-800 rounded h-5 w-1/3 animate-pulse" />
                  <div className="bg-gray-800 rounded h-5 w-1/4 animate-pulse" />
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-800">
                  <div className="bg-gray-800 rounded h-8 w-1/3 animate-pulse" />
                  <div className="bg-gray-800 rounded h-8 w-1/3 animate-pulse" />
                </div>
              </div>

              <div className="h-px bg-gray-800 mb-6" />

              {/* Payment section */}
              <div className="bg-gray-800 rounded h-6 w-1/3 mb-4 animate-pulse" />
              <div className="flex flex-col gap-3 mb-8">
                <div className="bg-gray-800 rounded-xl h-16 w-full animate-pulse" />
                <div className="bg-gray-800 rounded-xl h-16 w-full animate-pulse" />
              </div>

              {/* Button */}
              <div className="bg-gray-800 rounded-xl h-14 w-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ConfirmOrderSkeletonComponent as ConfirmOrderSkeleton };
