export const ProductsInCartSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex mb-5">
          {/* Image skeleton */}
          <div className="bg rounded mr-5 animate-pulse" style={{ width: '100px', height: '100px' }} />
          
          <div className="flex-1">
            {/* Product name skeleton */}
            <div className="bg rounded h-5 w-3/4 mb-2 animate-pulse" />
            
            {/* Price skeleton */}
            <div className="bg rounded h-6 w-1/3 mb-2 animate-pulse" />
            
            {/* Quantity selector skeleton */}
            <div className="flex items-center gap-2 mb-2">
              <div className="bg rounded h-8 w-8 animate-pulse" />
              <div className="bg rounded h-8 w-12 animate-pulse" />
              <div className="bg rounded h-8 w-8 animate-pulse" />
            </div>
            
            {/* Remove button skeleton */}
            <div className="bg rounded h-4 w-20 mt-3 animate-pulse" />
          </div>
        </div>
      ))}
    </>
  );
};
