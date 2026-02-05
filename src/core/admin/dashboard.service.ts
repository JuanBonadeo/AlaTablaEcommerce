import { prisma } from "@/db/client";
import { OrderStatus } from "@prisma/client";

export interface DashboardData {
    stats: {
        totalRevenue: number;
        ordersCount: number;
        productsCount: number;
        usersCount: number;
    };
    revenueData: Array<{ month: string; revenue: number; orders: number }>;
    topProducts: Array<{ name: string; sales: number; revenue: number }>;
    activity: Array<{ action: string; detail: string; time: string | Date; color: string }>;
}

export const DashboardService = {
    getStats: async (): Promise<DashboardData> => {
        const [totalOrders, totalUsers, totalProducts, totalRevenueResult] = await Promise.all([
            prisma.order.count(),
            prisma.user.count(),
            prisma.product.count({ where: { deletedAt: null } }),
            prisma.order.aggregate({
                where: {
                    status: {
                        in: [OrderStatus.PAID, OrderStatus.DELIVERED]
                    }
                },
                _sum: {
                    total: true
                }
            })
        ]);

        const totalRevenue = totalRevenueResult._sum.total || 0;

        // Last 6 months revenue and orders
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyStats = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo
                },
                status: {
                    not: OrderStatus.CANCELED
                }
            },
            select: {
                total: true,
                createdAt: true,
                status: true
            }
        });

        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const last6Months: Array<{ month: string; monthIdx: number; year: number; revenue: number; orders: number }> = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            last6Months.push({
                month: months[d.getMonth()],
                monthIdx: d.getMonth(),
                year: d.getFullYear(),
                revenue: 0,
                orders: 0
            });
        }

        monthlyStats.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const stats = last6Months.find(m => m.monthIdx === orderDate.getMonth() && m.year === orderDate.getFullYear());
            if (stats) {
                stats.orders++;
                if (order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED) {
                    stats.revenue += order.total;
                }
            }
        });

        // Top products
        const topProductsResult = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
                price: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        });

        const topProducts = await Promise.all(
            topProductsResult.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { name: true }
                });
                return {
                    name: product?.name || 'Producto desconocido',
                    sales: item._sum.quantity || 0,
                    revenue: (item._sum.quantity || 0) * (item._sum.price || 0) / (item._sum.quantity || 1) // Approximation
                };
            })
        );

        // Recent activity (dummy but based on real data)
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        });

        const activity = recentOrders.map(order => ({
            action: 'Nueva orden',
            detail: `#${order.id.slice(-6)} - $${order.total}`,
            time: order.createdAt,
            color: 'text-green-500'
        }));

        return {
            stats: {
                totalRevenue,
                ordersCount: totalOrders,
                productsCount: totalProducts,
                usersCount: totalUsers
            },
            revenueData: last6Months.map(({ month, revenue, orders }) => ({ month, revenue, orders })),
            topProducts,
            activity
        };
    }
};
