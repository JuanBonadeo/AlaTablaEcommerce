
const ConfirmOrderSkeletonComponent = () => {
  return (
    <div className="flex justify-center items-start py-4 sm:py-8">
      <div className="flex flex-col w-full gap-6 sm:gap-8">

        {/* Header skeleton */}
        <div className="flex items-center gap-3 pb-4 sm:pb-6 border-b border-gray-800/50">
          <div className="bg-[#4e4e4e] rounded-xl h-10 w-10 sm:h-12 sm:w-12 animate-pulse shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="bg-[#4e4e4e] rounded h-5 sm:h-6 w-32 sm:w-48 mb-2 animate-pulse" />
            <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-40 sm:w-64 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

          {/* Left: Cart skeleton */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="bg-[#171718] border border-gray-800/50 rounded-2xl p-4 sm:p-6">
              <div className="bg-[#4e4e4e] rounded h-5 sm:h-7 w-28 sm:w-40 mb-4 sm:mb-6 animate-pulse" />

              {/* Product items skeleton */}
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="bg-[#4e4e4e] rounded animate-pulse shrink-0" style={{ width: '60px', height: '60px' }} />
                  <div className="flex-1 min-w-0">
                    <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-full max-w-[200px] mb-2 animate-pulse" />
                    <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-20 sm:w-24 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#171718] border border-gray-800/50 rounded-2xl p-4 sm:p-6">
              <div className="bg-[#4e4e4e] rounded h-5 sm:h-7 w-32 sm:w-48 mb-4 animate-pulse" />
              <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-full max-w-[250px] mb-2 animate-pulse" />
              <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-32 sm:w-40 animate-pulse" />
            </div>
          </div>

          {/* Right: Address + Payment skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            <div className="bg-[#171718] border border-gray-800/50 rounded-2xl p-4 sm:p-6">
              {/* Summary section */}
              <div className="bg-[#4e4e4e] rounded h-5 sm:h-7 w-32 sm:w-40 mb-4 sm:mb-6 animate-pulse" />

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center gap-2">
                  <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-20 sm:w-28 animate-pulse" />
                  <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-16 sm:w-20 animate-pulse" />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-16 sm:w-24 animate-pulse" />
                  <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-16 sm:w-20 animate-pulse" />
                </div>
                <div className="flex justify-between items-center gap-2 pt-3 sm:pt-4 border-t border-gray-800/50">
                  <div className="bg-[#4e4e4e] rounded h-6 sm:h-8 w-16 sm:w-24 animate-pulse" />
                  <div className="bg-[#4e4e4e] rounded h-6 sm:h-8 w-20 sm:w-28 animate-pulse" />
                </div>
              </div>

              <div className="h-px bg-gray-800/50 mb-4 sm:mb-6" />

              {/* Payment section */}
              <div className="bg-[#4e4e4e] rounded h-5 sm:h-6 w-28 sm:w-36 mb-3 sm:mb-4 animate-pulse" />
              <div className="flex flex-col gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="bg-[#4e4e4e] rounded-xl h-12 sm:h-16 w-full animate-pulse" />
                <div className="bg-[#4e4e4e] rounded-xl h-12 sm:h-16 w-full animate-pulse" />
              </div>

              {/* Button */}
              <div className="bg-[#4e4e4e] rounded-xl h-12 sm:h-14 w-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ConfirmOrderSkeletonComponent as ConfirmOrderSkeleton };
