"use server";

import { DashboardService } from "@/core/admin/dashboard.service";

export async function getDashboardStatsAction() {
    try {
        const stats = await DashboardService.getStats();
        return {
            success: true,
            data: stats
        };
    } catch (error) {
        console.error("Error in getDashboardStatsAction:", error);
        return {
            success: false,
            message: "Error al obtener estadísticas del dashboard"
        };
    }
}
