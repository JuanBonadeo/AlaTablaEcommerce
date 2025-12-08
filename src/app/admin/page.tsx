'use client';

import { StatCard } from '@/components/admin/StatCard';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from 'lucide-react';
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

const revenueData = [
  { month: 'Ene', revenue: 12400, orders: 45 },
  { month: 'Feb', revenue: 15800, orders: 52 },
  { month: 'Mar', revenue: 19200, orders: 68 },
  { month: 'Abr', revenue: 17600, orders: 61 },
  { month: 'May', revenue: 22100, orders: 78 },
  { month: 'Jun', revenue: 24500, orders: 85 },
];

const topProducts = [
  { name: 'Cuchillo Chef 8"', sales: 156, revenue: 31200, trend: 12.5 },
  { name: 'Set de Tablas', sales: 98, revenue: 19600, trend: -5.2 },
  { name: 'Afilador Premium', sales: 87, revenue: 13050, trend: 8.7 },
  { name: 'Cuchillo Santoku', sales: 76, revenue: 15200, trend: -3.1 },
  { name: 'Tabla de Corte XL', sales: 65, revenue: 9750, trend: 15.3 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#171718] border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-gray-400 text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-white font-medium">
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Resumen general de tu tienda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas Totales"
          value="$24,500"
          icon={DollarSign}
          trend={{ value: '12.5%', isPositive: true }}
          iconBgColor="bg-green-500"
        />
        <StatCard
          title="Órdenes"
          value="85"
          icon={ShoppingCart}
          trend={{ value: '8.2%', isPositive: true }}
          iconBgColor="bg-blue-500"
        />
        <StatCard
          title="Productos"
          value="124"
          icon={Package}
          trend={{ value: '3.1%', isPositive: false }}
          iconBgColor="bg-purple-500"
        />
        <StatCard
          title="Clientes"
          value="342"
          icon={Users}
          trend={{ value: '15.3%', isPositive: true }}
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
              <Bar dataKey="orders" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Productos Más Vendidos</h2>
          <p className="text-sm text-gray-400">Este mes</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">#</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Producto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Ventas</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Ingresos</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                  <td className="py-4 px-4 text-gray-300">{index + 1}</td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-white">{product.name}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{product.sales} unidades</td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-green-500">${product.revenue.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    {product.trend > 0 ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <TrendingUp size={16} />
                        <span className="text-sm font-medium">+{product.trend}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-500">
                        <TrendingDown size={16} />
                        <span className="text-sm font-medium">{product.trend}%</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {[
              { action: 'Nueva orden', detail: '#1234 - $450', time: 'Hace 5 min', color: 'text-green-500' },
              { action: 'Producto actualizado', detail: 'Cuchillo Chef 8"', time: 'Hace 15 min', color: 'text-blue-500' },
              { action: 'Nuevo usuario', detail: 'Juan Pérez', time: 'Hace 1 hora', color: 'text-purple-500' },
              { action: 'Orden completada', detail: '#1230 - $320', time: 'Hace 2 horas', color: 'text-orange-500' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div className={`w-2 h-2 ${activity.color.replace('text-', 'bg-')} rounded-full mt-2`}></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.detail}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Alertas</h2>
          <div className="space-y-3">
            {[
              { type: 'warning', message: '5 productos con stock bajo', action: 'Ver productos' },
              { type: 'info', message: '3 órdenes pendientes de envío', action: 'Ver órdenes' },
              { type: 'success', message: 'Meta de ventas alcanzada este mes', action: 'Ver reporte' },
            ].map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  alert.type === 'warning'
                    ? 'bg-yellow-500/10 border-yellow-500/50'
                    : alert.type === 'info'
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-green-500/10 border-green-500/50'
                }`}
              >
                <p className="text-white text-sm font-medium mb-2">{alert.message}</p>
                <button className="text-xs text-orange-500 hover:text-orange-400 font-medium">
                  {alert.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
