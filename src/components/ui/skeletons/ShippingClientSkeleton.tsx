export const ShippingClientSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 animate-pulse">
      {/* Información de la dirección */}
      <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl shadow-xl border-2 border-gray-800/50 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-4 bg-[#4e4e4e] rounded" />
          <div className="h-5 w-40 bg-[#4e4e4e] rounded" />
        </div>
        <div className="pl-3 sm:pl-4 border-l-2 border-gray-700/50 space-y-2">
          <div className="h-4 w-48 bg-[#4e4e4e] rounded" />
          <div className="h-3 w-64 bg-[#4e4e4e] rounded" />
          <div className="h-3 w-56 bg-[#4e4e4e] rounded" />
          <div className="h-3 w-40 bg-[#4e4e4e] rounded" />
        </div>
      </div>

      {/* Opciones de envío */}
      <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl shadow-xl border-2 border-gray-800/50 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <div className="h-1 w-8 bg-[#4e4e4e] rounded-full" />
          <div className="h-5 w-56 bg-[#4e4e4e] rounded" />
        </div>

        <div className="space-y-3">
          {/* Shipping option 1 */}
          <div className="p-3 sm:p-4 rounded-xl border-2 border-gray-800/50 bg-[#0a0a0a]">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-4 flex-1">
                <div className="w-10 h-10 bg-[#4e4e4e] rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-[#4e4e4e] rounded" />
                  <div className="h-3 w-48 bg-[#4e4e4e] rounded" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-5 w-20 bg-[#4e4e4e] rounded ml-auto" />
                <div className="h-4 w-16 bg-[#4e4e4e] rounded ml-auto" />
              </div>
            </div>
          </div>

          {/* Shipping option 2 */}
          <div className="p-3 sm:p-4 rounded-xl border-2 border-gray-800/50 bg-[#0a0a0a]">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-4 flex-1">
                <div className="w-10 h-10 bg-[#4e4e4e] rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 bg-[#4e4e4e] rounded" />
                  <div className="h-3 w-44 bg-[#4e4e4e] rounded" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-5 w-24 bg-[#4e4e4e] rounded ml-auto" />
              </div>
            </div>
          </div>

          {/* Shipping option 3 */}
          <div className="p-3 sm:p-4 rounded-xl border-2 border-gray-800/50 bg-[#0a0a0a]">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-4 flex-1">
                <div className="w-10 h-10 bg-[#4e4e4e] rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 bg-[#4e4e4e] rounded" />
                  <div className="h-3 w-52 bg-[#4e4e4e] rounded" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-5 w-20 bg-[#4e4e4e] rounded ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-3 sm:gap-4 mt-2">
        <div className="flex-1 h-12 sm:h-14 bg-[#4e4e4e] rounded-xl" />
        <div className="flex-1 h-12 sm:h-14 bg-[#4e4e4e] rounded-xl" />
      </div>
    </div>
  );
};
