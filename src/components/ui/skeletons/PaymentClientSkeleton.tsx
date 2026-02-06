export const PaymentClientSkeleton = () => {
  return (
    <div className="flex justify-center items-start pb-20 px-3 sm:px-6 md:px-8 py-4 sm:py-8">
      <div className="flex flex-col w-full max-w-[1000px] gap-4 sm:gap-6 lg:gap-8">

        {/* Order Info Header skeleton */}
        <div className="bg-[#171718] rounded-xl shadow-lg p-4 sm:p-6 border border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <div className="bg-[#4e4e4e] rounded h-6 sm:h-8 w-40 sm:w-48 mb-2 animate-pulse" />
              <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-28 sm:w-32 animate-pulse" />
            </div>
            <div className="w-full sm:w-auto sm:text-right">
              <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-20 sm:w-24 mb-1 animate-pulse" />
              <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-28 sm:w-32 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

          {/* Left: Order Items skeleton */}
          <div className="bg-[#171718] rounded-xl shadow-lg p-4 sm:p-6 border border-gray-800">
            <div className="bg-[#4e4e4e] rounded h-5 sm:h-7 w-32 sm:w-40 mb-4 animate-pulse" />

            {/* Product items skeleton */}
            <div className="space-y-3 sm:space-y-4 mb-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-800">
                  <div className="bg-[#4e4e4e] rounded-lg w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-full max-w-[180px] mb-2 animate-pulse" />
                    <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-24 sm:w-32 mb-2 animate-pulse" />
                    <div className="flex justify-between gap-2">
                      <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-16 sm:w-20 animate-pulse" />
                      <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-20 sm:w-24 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary skeleton */}
            <div className="border-t border-gray-800 pt-3 sm:pt-4 space-y-2">
              <div className="flex justify-between items-center gap-2">
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-20 sm:w-24 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-16 sm:w-20 animate-pulse" />
              </div>
              <div className="flex justify-between items-center gap-2">
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-16 sm:w-20 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-16 sm:w-20 animate-pulse" />
              </div>
              <div className="flex justify-between items-center gap-2 pt-2">
                <div className="bg-[#4e4e4e] rounded h-5 sm:h-6 w-16 sm:w-20 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-5 sm:h-6 w-24 sm:w-32 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right: Payment Info skeleton */}
          <div className="flex flex-col gap-4 sm:gap-6">

            {/* Address skeleton */}
            <div className="bg-[#171718] rounded-xl shadow-lg p-4 sm:p-6 border border-gray-800">
              <div className="bg-[#4e4e4e] rounded h-5 sm:h-7 w-40 sm:w-48 mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="bg-[#4e4e4e] rounded h-4 sm:h-5 w-full max-w-[200px] animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-full animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-4/5 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-28 sm:w-32 animate-pulse" />
              </div>
            </div>

            {/* Payment instructions skeleton */}
            <div className="bg-[#171718] rounded-xl shadow-lg p-4 sm:p-6 border border-gray-800">
              <div className="bg-[#4e4e4e] rounded h-5 sm:h-7 w-40 sm:w-48 mb-3 animate-pulse" />

              {/* Payment method */}
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-24 sm:w-28 mb-2 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-5 sm:h-6 w-32 sm:w-40 animate-pulse" />
              </div>

              {/* Amount */}
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-20 sm:w-24 mb-2 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-6 sm:h-8 w-36 sm:w-48 animate-pulse" />
              </div>

              {/* Bank alias */}
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="bg-[#4e4e4e] rounded h-3 sm:h-4 w-16 sm:w-20 mb-2 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#4e4e4e] rounded h-9 sm:h-10 animate-pulse" />
                  <div className="bg-[#4e4e4e] rounded h-9 sm:h-10 w-20 sm:w-24 animate-pulse shrink-0" />
                </div>
              </div>

              {/* Button */}
              <div className="bg-[#4e4e4e] rounded h-11 sm:h-12 w-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
