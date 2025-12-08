export const ProductDetailSkeleton = () => {
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-3">
      
      {/* Slideshow skeleton */}
      <div className="col-span-1 lg:col-span-2">
        <div className="bg rounded animate-pulse w-full" style={{ paddingBottom: '100%' }} />
        
        {/* Thumbnails skeleton */}
        <div className="flex gap-2 mt-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg rounded animate-pulse w-20 h-20" />
          ))}
        </div>
      </div>

      {/* Details skeleton */}
      <div className="col-span-1 px-5 lg:mt-20">
        {/* Title skeleton */}
        <div className="bg rounded h-9 w-3/4 mb-5 animate-pulse" />
        
        {/* Price skeleton */}
        <div className="bg rounded h-8 w-1/3 mb-5 animate-pulse" />
        
        {/* Variants/Size selector skeleton */}
        <div className="mb-5">
          <div className="bg rounded h-5 w-1/4 mb-2 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg rounded h-10 w-20 animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Quantity selector skeleton */}
        <div className="mb-5">
          <div className="bg rounded h-5 w-1/4 mb-2 animate-pulse" />
          <div className="flex gap-2">
            <div className="bg rounded h-10 w-12 animate-pulse" />
            <div className="bg rounded h-10 w-16 animate-pulse" />
            <div className="bg rounded h-10 w-12 animate-pulse" />
          </div>
        </div>
        
        {/* Add to cart button skeleton */}
        <div className="bg rounded h-12 w-full mb-8 animate-pulse" />
        
        {/* Description title skeleton */}
        <div className="bg rounded h-7 w-1/3 mb-2 animate-pulse" />
        
        {/* Description text skeleton */}
        <div className="space-y-2">
          <div className="bg rounded h-4 w-full animate-pulse" />
          <div className="bg rounded h-4 w-full animate-pulse" />
          <div className="bg rounded h-4 w-3/4 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
