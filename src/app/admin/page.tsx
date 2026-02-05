import { getDashboardStatsAction } from "@/lib/actions/admin/dashboard.actions";
import DashboardClient from "./DashboardClient";
import { DashboardData } from "@/core/admin/dashboard.service";

export default async function AdminDashboardPage() {
  const result = await getDashboardStatsAction();

  if (!result.success || !result.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Error al cargar datos</h2>
          <p>{result.message || "Hubo un problema al conectar con la base de datos."}</p>
        </div>
      </div>
    );
  }

  return <DashboardClient data={result.data as DashboardData} />;
}
