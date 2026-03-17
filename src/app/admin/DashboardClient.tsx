'use client';

import { StatCard } from '@/components/admin/StatCard';
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    Download,
    Search,
    ArrowRight,
    Layers,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { formatPrice } from '@/lib/utils/pricing';

interface DashboardClientProps {
    data: {
        stats: {
            totalRevenue: number;
            totalProfit: number;
            ordersCount: number;
            productsCount: number;
            usersCount: number;
        };
        revenueData: Array<{ month: string; revenue: number; orders: number }>;
        topProducts: Array<{ name: string; sales: number; revenue: number }>;
        activity: Array<{ action: string; detail: string; time: string | Date; color: string }>;
    };
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-700 bg-[#111a21]/95 p-3 shadow-lg backdrop-blur">
                <p className="mb-2 text-sm text-slate-400">{label}</p>
                {payload.map((entry, index: number) => (
                    <p key={index} className="font-medium text-slate-100">
                        {entry.name}: {entry.name.includes('Ingresos') ? formatPrice(entry.value) : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DashboardClient({ data }: DashboardClientProps) {
    const { stats, revenueData, topProducts, activity } = data;
    const [selectedMonths, setSelectedMonths] = useState(6);
    const [productQuery, setProductQuery] = useState('');
    const [showAllActivity, setShowAllActivity] = useState(false);

    const periodOptions = [
        { label: '3M', months: 3 },
        { label: '6M', months: 6 },
        { label: '12M', months: 12 },
    ];

    const filteredRevenueData = useMemo(
        () => revenueData.slice(-selectedMonths),
        [revenueData, selectedMonths]
    );

    const revenueTrend = useMemo(() => {
        if (filteredRevenueData.length < 2) {
            return { value: '0.0%', isPositive: true };
        }

        const first = filteredRevenueData[0].revenue;
        const last = filteredRevenueData[filteredRevenueData.length - 1].revenue;

        if (first === 0) {
            return { value: '100%', isPositive: true };
        }

        const diff = ((last - first) / first) * 100;
        return {
            value: `${Math.abs(diff).toFixed(1)}%`,
            isPositive: diff >= 0,
        };
    }, [filteredRevenueData]);

    const averageTicket = stats.ordersCount > 0 ? stats.totalRevenue / stats.ordersCount : 0;

    const visibleTopProducts = useMemo(
        () => topProducts.filter((product) => product.name.toLowerCase().includes(productQuery.trim().toLowerCase())),
        [topProducts, productQuery]
    );

    const visibleActivity = showAllActivity ? activity : activity.slice(0, 4);

    const downloadProductsCsv = () => {
        const rows = [
            ['Ranking', 'Producto', 'Ventas', 'Ingresos'],
            ...visibleTopProducts.map((product, index) => [
                `${index + 1}`,
                product.name,
                `${product.sales}`,
                `${product.revenue}`,
            ]),
        ];

        const csv = rows.map((row) => row.map((col) => `"${String(col).replaceAll('"', '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', 'top-productos.csv');
        link.click();
        URL.revokeObjectURL(url);
    };

    const quickActions = [
        {
            label: 'Crear producto',
            description: 'Carga productos nuevos al catálogo',
            href: '/admin/products',
        },
        {
            label: 'Revisar órdenes',
            description: 'Gestiona pagos y estados pendientes',
            href: '/admin/orders',
        },
        {
            label: 'Actualizar ofertas',
            description: 'Activa descuentos por temporada',
            href: '/admin/offers',
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-orange-500/10 p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                            <Layers size={14} />
                            Centro de Control
                        </p>
                        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-400 sm:text-base">Resumen real de tu tienda con foco en operaciones y crecimiento.</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {periodOptions.map((option) => (
                            <button
                                key={option.months}
                                onClick={() => setSelectedMonths(option.months)}
                                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                                    selectedMonths === option.months
                                        ? 'bg-orange-500 text-white shadow-[0_10px_24px_-16px_rgba(249,115,22,0.95)]'
                                        : 'border border-slate-700 bg-slate-900/75 text-slate-300 hover:border-slate-600 hover:text-slate-100'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:gap-4">
                <StatCard
                    title="Ventas Totales"
                    value={currencyFormat(stats.totalRevenue)}
                    icon={DollarSign}
                    trend={revenueTrend}
                    iconBgColor="bg-green-500"
                />
                <StatCard
                    title="Ganancia Est."
                    value={currencyFormat(stats.totalProfit)}
                    icon={TrendingUp}
                    iconBgColor="bg-emerald-500"
                />
                <StatCard
                    title="Órdenes"
                    value={stats.ordersCount.toString()}
                    icon={ShoppingCart}
                    iconBgColor="bg-blue-500"
                />
                <StatCard
                    title="Productos"
                    value={stats.productsCount.toString()}
                    icon={Package}
                    iconBgColor="bg-purple-500"
                />
                <StatCard
                    title="Clientes"
                    value={stats.usersCount.toString()}
                    icon={Users}
                    iconBgColor="bg-orange-500"
                />
                <StatCard
                    title="Ticket Promedio"
                    value={currencyFormat(averageTicket)}
                    icon={TrendingUp}
                    iconBgColor="bg-cyan-500"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
                {/* Revenue Chart */}
                <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-3 sm:p-4 lg:p-6">
                    <div className="mb-4 sm:mb-6">
                        <h2 className="mb-1 text-lg font-bold text-slate-100 sm:text-xl">Ingresos Mensuales</h2>
                        <p className="text-xs text-slate-400 sm:text-sm">Últimos {selectedMonths} meses</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={filteredRevenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                name="Ingresos"
                                stroke="#f97316"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Chart */}
                <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-3 sm:p-4 lg:p-6">
                    <div className="mb-4 sm:mb-6">
                        <h2 className="mb-1 text-lg font-bold text-slate-100 sm:text-xl">Órdenes por Mes</h2>
                        <p className="text-xs text-slate-400 sm:text-sm">Últimos {selectedMonths} meses</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={filteredRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="orders" name="Órdenes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-3 sm:p-4 lg:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="mb-1 text-lg font-bold text-slate-100 sm:text-xl">Productos Más Vendidos</h2>
                        <p className="text-xs text-slate-400 sm:text-sm">Histórico por volumen de ventas</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2">
                            <Search size={14} className="text-slate-400" />
                            <input
                                type="text"
                                value={productQuery}
                                onChange={(event) => setProductQuery(event.target.value)}
                                placeholder="Buscar producto"
                                className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none sm:w-44 sm:text-sm"
                            />
                        </div>
                        <button
                            onClick={downloadProductsCsv}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 sm:text-sm"
                        >
                            <Download size={14} />
                            Exportar CSV
                        </button>
                    </div>
                </div>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">#</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Producto</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Ventas</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Ingresos Est.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleTopProducts.length > 0 ? visibleTopProducts.map((product, index) => (
                                <tr key={index} className="border-b border-slate-800 transition-colors hover:bg-slate-900/70">
                                    <td className="px-4 py-4 text-slate-300">{index + 1}</td>
                                    <td className="px-4 py-4">
                                        <span className="font-medium text-slate-100">{product.name}</span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-300">{product.sales} unidades</td>
                                    <td className="px-4 py-4">
                                        <span className="font-medium text-emerald-400">{formatPrice(product.revenue)}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-500">No hay resultados para esa búsqueda</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                    {visibleTopProducts.length > 0 ? visibleTopProducts.map((product, index) => (
                        <div key={index} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-400">#{index + 1}</span>
                                <span className="font-medium text-emerald-400">{formatPrice(product.revenue)}</span>
                            </div>
                            <h3 className="mb-1 font-medium text-slate-100">{product.name}</h3>
                            <p className="text-sm text-slate-300">{product.sales} unidades vendidas</p>
                        </div>
                    )) : (
                        <p className="py-8 text-center text-slate-500">No hay resultados para esa búsqueda</p>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-3 sm:p-4 lg:p-6">
                    <div className="mb-3 flex items-center justify-between sm:mb-4">
                        <h2 className="text-lg font-bold text-slate-100 sm:text-xl">Actividad Reciente</h2>
                        {activity.length > 4 && (
                            <button
                                onClick={() => setShowAllActivity((prev) => !prev)}
                                className="text-xs font-semibold text-orange-300 transition-colors hover:text-orange-200"
                            >
                                {showAllActivity ? 'Mostrar menos' : 'Ver todo'}
                            </button>
                        )}
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {visibleActivity.length > 0 ? visibleActivity.map((act, index) => {
                            const date = new Date(act.time);
                            const now = new Date();
                            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

                            let timeStr = 'Recientemente';
                            if (diffInSeconds < 60) timeStr = 'Hace un momento';
                            else if (diffInSeconds < 3600) timeStr = `Hace ${Math.floor(diffInSeconds / 60)} min`;
                            else if (diffInSeconds < 86400) timeStr = `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
                            else timeStr = date.toLocaleDateString('es-ES');

                            return (
                                <div key={index} className="flex items-start gap-2 border-b border-slate-800 pb-3 sm:gap-3 sm:pb-4 last:border-0 last:pb-0">
                                    <div className={`w-2 h-2 ${act.color.replace('text-', 'bg-')} rounded-full mt-2`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-100 sm:text-base">{act.action}</p>
                                        <p className="text-xs text-slate-400 sm:text-sm">{act.detail}</p>
                                    </div>
                                    <span className="shrink-0 text-xs text-slate-500">
                                        {timeStr}
                                    </span>
                                </div>
                            );
                        }) : (
                            <p className="py-4 text-center text-sm text-slate-500">Sin actividad reciente</p>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-3 sm:p-4 lg:p-6">
                    <h2 className="mb-3 text-lg font-bold text-slate-100 sm:mb-4 sm:text-xl">Acciones Rápidas</h2>
                    <div className="space-y-2 sm:space-y-3">
                        {quickActions.map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="group block rounded-lg border border-slate-700 bg-slate-900/70 p-3 transition-all hover:border-orange-400/60 hover:bg-slate-800/90 sm:p-4"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Atajo</p>
                                        <p className="text-sm font-semibold text-slate-100">{action.label}</p>
                                        <p className="text-xs text-slate-400">{action.description}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-orange-300" />
                                </div>
                            </Link>
                        ))}

                        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 sm:p-4">
                            <p className="mb-1 text-xs font-medium text-emerald-300 sm:text-sm">Estado del Sistema</p>
                            <p className="text-xs text-emerald-200">Todos los servicios operando normalmente.</p>
                        </div>
                        <div className="rounded-lg border border-orange-500/40 bg-orange-500/10 p-3 sm:p-4">
                            <p className="mb-1 text-xs font-medium text-orange-300 sm:text-sm">Próximos Pasos</p>
                            <p className="text-xs text-orange-200">Asegúrate de revisar las órdenes pendientes de confirmación.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
