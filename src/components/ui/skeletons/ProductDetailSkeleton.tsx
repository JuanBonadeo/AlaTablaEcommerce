export const ProductDetailSkeleton = () => {
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">

      {/* Slideshow skeleton */}
      <div className="col-span-1 lg:col-span-2 bg-[#171718] rounded-xl p-4 border border-gray-800">
        <div className="bg-[#4e4e4e] rounded-xl animate-pulse w-full aspect-square md:aspect-auto md:h-[500px]" />

        {/* Thumbnails skeleton */}
        <div className="flex gap-4 mt-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#4e4e4e] rounded-lg animate-pulse w-24 h-24 shrink-0" />
          ))}
        </div>
      </div>

      {/* Details skeleton */}
      <div className="col-span-1">
        <div className="bg-[#171718] rounded-xl p-6 border border-gray-800 shadow-xl sticky top-24">
          {/* Title skeleton */}
          <div className="bg-[#4e4e4e] rounded-lg h-10 w-3/4 mb-6 animate-pulse" />

          {/* Price skeleton */}
          <div className="bg-[#0a0a0a] border border-gray-800 p-4 rounded-lg mb-6">
            <div className="bg-[#4e4e4e] rounded h-8 w-1/3 mb-2 animate-pulse" />
            <div className="bg-[#4e4e4e] rounded h-4 w-1/4 animate-pulse" />
          </div>

          {/* Variants/Size selector skeleton */}
          <div className="mb-6">
            <div className="bg-[#4e4e4e] rounded h-5 w-1/4 mb-2 animate-pulse" />
            <div className="bg-[#4e4e4e] rounded h-12 w-full animate-pulse" />
          </div>

          {/* Quantity selector skeleton */}
          <div className="mb-6">
            <div className="bg-[#4e4e4e] rounded h-5 w-1/4 mb-2 animate-pulse" />
            <div className="flex gap-2">
              <div className="bg-[#4e4e4e] rounded h-10 w-12 animate-pulse" />
              <div className="bg-[#4e4e4e] rounded h-10 w-16 animate-pulse" />
              <div className="bg-[#4e4e4e] rounded h-10 w-12 animate-pulse" />
            </div>
          </div>

          {/* Add to cart button skeleton */}
          <div className="bg-orange-900/40 rounded-xl h-14 w-full mb-8 animate-pulse" />

          {/* Description title skeleton */}
          <div className="bg-[#4e4e4e] rounded h-6 w-1/3 mb-4 animate-pulse" />

          {/* Description text skeleton */}
          <div className="space-y-3">
            <div className="bg-[#4e4e4e] rounded h-4 w-full animate-pulse" />
            <div className="bg-[#4e4e4e] rounded h-4 w-full animate-pulse" />
            <div className="bg-[#4e4e4e] rounded h-4 w-5/6 animate-pulse" />
            <div className="bg-[#4e4e4e] rounded h-4 w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
