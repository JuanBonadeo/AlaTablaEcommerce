'use client';

import { StatCard } from '@/components/admin/StatCard';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from 'lucide-react';
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
            <div className="bg-[#171718] border border-gray-700 rounded-lg p-3 shadow-lg">
                <p className="text-gray-400 text-sm mb-2">{label}</p>
                {payload.map((entry, index: number) => (
                    <p key={index} className="text-white font-medium">
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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Resumen real de tu tienda basado en datos</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Ventas Totales"
                    value={currencyFormat(stats.totalRevenue)}
                    icon={DollarSign}
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
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-1">Ingresos Mensuales</h2>
                        <p className="text-sm text-gray-400">Últimos 6 meses</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
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
                <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-1">Órdenes por Mes</h2>
                        <p className="text-sm text-gray-400">Últimos 6 meses</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="orders" name="Órdenes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Productos Más Vendidos</h2>
                    <p className="text-sm text-gray-400">Histórico por volumen de ventas</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">#</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Producto</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Ventas</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Ingresos Est.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.length > 0 ? topProducts.map((product, index) => (
                                <tr key={index} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                                    <td className="py-4 px-4 text-gray-300">{index + 1}</td>
                                    <td className="py-4 px-4">
                                        <span className="font-medium text-white">{product.name}</span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-300">{product.sales} unidades</td>
                                    <td className="py-4 px-4">
                                        <span className="font-medium text-green-500">{formatPrice(product.revenue)}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500">No hay datos de ventas aún</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
                    <div className="space-y-4">
                        {activity.length > 0 ? activity.map((act, index) => {
                            const date = new Date(act.time);
                            const now = new Date();
                            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

                            let timeStr = 'Recientemente';
                            if (diffInSeconds < 60) timeStr = 'Hace un momento';
                            else if (diffInSeconds < 3600) timeStr = `Hace ${Math.floor(diffInSeconds / 60)} min`;
                            else if (diffInSeconds < 86400) timeStr = `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
                            else timeStr = date.toLocaleDateString('es-ES');

                            return (
                                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                                    <div className={`w-2 h-2 ${act.color.replace('text-', 'bg-')} rounded-full mt-2`}></div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{act.action}</p>
                                        <p className="text-sm text-gray-400">{act.detail}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {timeStr}
                                    </span>
                                </div>
                            );
                        }) : (
                            <p className="text-gray-500 text-center py-4">Sin actividad reciente</p>
                        )}
                    </div>
                </div>

                <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Información de la Tienda</h2>
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/50">
                            <p className="text-white text-sm font-medium mb-1">Estado del Sistema</p>
                            <p className="text-blue-400 text-xs">Todos los servicios operando normalmente.</p>
                        </div>
                        <div className="p-4 rounded-lg border bg-orange-500/10 border-orange-500/50">
                            <p className="text-white text-sm font-medium mb-1">Próximos Pasos</p>
                            <p className="text-orange-400 text-xs">Asegúrate de revisar las órdenes pendientes de confirmación.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
