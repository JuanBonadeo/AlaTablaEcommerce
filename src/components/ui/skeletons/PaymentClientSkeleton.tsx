export const PaymentClientSkeleton = () => {
  return (
    <div className="flex justify-center items-start mb-20 px-4 md:px-8 py-8">
      <div className="flex flex-col w-full max-w-[1000px] gap-8">

        {/* Order Info Header skeleton */}
        <div className="bg-[#171718] rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="bg-[#4e4e4e] rounded h-8 w-48 mb-2 animate-pulse" />
              <div className="bg-[#4e4e4e] rounded h-5 w-32 animate-pulse" />
            </div>
            <div className="text-right">
              <div className="bg-[#4e4e4e] rounded h-4 w-24 mb-1 animate-pulse" />
              <div className="bg-[#4e4e4e] rounded h-5 w-32 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Order Items skeleton */}
          <div className="bg-[#171718] rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="bg-[#4e4e4e] rounded h-7 w-1/3 mb-4 animate-pulse" />

            {/* Product items skeleton */}
            <div className="space-y-4 mb-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-gray-800">
                  <div className="bg-[#4e4e4e] rounded-lg w-16 h-16 flex-shrink-0 animate-pulse" />
                  <div className="flex-1">
                    <div className="bg-[#4e4e4e] rounded h-5 w-3/4 mb-2 animate-pulse" />
                    <div className="bg-[#4e4e4e] rounded h-4 w-1/2 mb-2 animate-pulse" />
                    <div className="flex justify-between">
                      <div className="bg-[#4e4e4e] rounded h-4 w-20 animate-pulse" />
                      <div className="bg-[#4e4e4e] rounded h-4 w-24 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary skeleton */}
            <div className="border-t border-gray-800 pt-4 space-y-2">
              <div className="flex justify-between">
                <div className="bg-[#4e4e4e] rounded h-4 w-1/3 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-4 w-24 animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="bg-[#4e4e4e] rounded h-4 w-1/4 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-4 w-24 animate-pulse" />
              </div>
              <div className="flex justify-between pt-2">
                <div className="bg-[#4e4e4e] rounded h-6 w-1/4 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-6 w-32 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right: Payment Info skeleton */}
          <div className="flex flex-col gap-6">

            {/* Address skeleton */}
            <div className="bg-[#171718] rounded-xl shadow-lg p-6 border border-gray-800">
              <div className="bg-[#4e4e4e] rounded h-7 w-2/3 mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="bg-[#4e4e4e] rounded h-5 w-3/4 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-4 w-full animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-4 w-2/3 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-4 w-1/2 animate-pulse" />
              </div>
            </div>

            {/* Payment instructions skeleton */}
            <div className="bg-[#171718] rounded-xl shadow-lg p-6 border border-gray-800">
              <div className="bg-[#4e4e4e] rounded h-7 w-2/3 mb-3 animate-pulse" />

              {/* Payment method */}
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 mb-4">
                <div className="bg-[#4e4e4e] rounded h-4 w-1/3 mb-2 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-6 w-1/2 animate-pulse" />
              </div>

              {/* Amount */}
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 mb-4">
                <div className="bg-[#4e4e4e] rounded h-4 w-1/3 mb-2 animate-pulse" />
                <div className="bg-[#4e4e4e] rounded h-8 w-2/3 animate-pulse" />
              </div>

              {/* Bank alias */}
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 mb-4">
                <div className="bg-[#4e4e4e] rounded h-4 w-1/4 mb-2 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#4e4e4e] rounded h-10 animate-pulse" />
                  <div className="bg-[#4e4e4e] rounded h-10 w-24 animate-pulse" />
                </div>
              </div>

              {/* Button */}
              <div className="bg-[#4e4e4e] rounded h-12 w-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
