export const ToastNotification = ({ show, message = "Producto agregado al carrito" }: { show: boolean, message?: string }) => {
    if (!show) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed right-6 bottom-6 bg-[#171718] border border-green-500/30 text-green-500 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {message}
        </div>
    );
};
