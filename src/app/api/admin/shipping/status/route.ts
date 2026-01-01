import { NextResponse } from "next/server";
import { CorreoArgentinoService } from "@/core/shipments/correo-argentino.service";
import { ResponseHandler } from "@/core/shared/responseHandler";
import { logger } from "@/core/shared/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tracking = body?.tracking as string | undefined;

    if (!tracking) {
      return NextResponse.json(
        { success: false, message: "Tracking number es requerido" },
        { status: 400 }
      );
    }

    const shipmentStatus = await CorreoArgentinoService.getShipmentStatus(tracking);

    return NextResponse.json(
      ResponseHandler.success(shipmentStatus, "Estado del envío obtenido"),
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error al obtener estado del envío", { error });
    return NextResponse.json(
      { success: false, message: "No se pudo obtener el estado del envío" },
      { status: 500 }
    );
  }
}
