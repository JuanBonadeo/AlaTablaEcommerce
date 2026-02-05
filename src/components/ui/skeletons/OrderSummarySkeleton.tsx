export const OrderSummarySkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#4e4e4e] rounded h-5 w-3/4 animate-pulse" />
        <div className="bg-[#4e4e4e] rounded h-5 w-1/2 ml-auto animate-pulse" />

        <div className="bg-[#4e4e4e] rounded h-5 w-2/3 animate-pulse" />
        <div className="bg-[#4e4e4e] rounded h-5 w-1/3 ml-auto animate-pulse" />

        <div className="bg-[#4e4e4e] rounded h-7 w-1/2 mt-5 animate-pulse" />
        <div className="bg-[#4e4e4e] rounded h-7 w-2/3 ml-auto mt-5 animate-pulse" />
      </div>

      <div className="mt-5 mb-2 w-full">
        <div className="bg-[#4e4e4e] rounded h-12 w-full animate-pulse" />
      </div>
    </div>
  );
};
