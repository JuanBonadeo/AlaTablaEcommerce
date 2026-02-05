import { NextResponse } from "next/server";
import { AndreaniService } from "@/core/shipments/andreani.service";
import { logger } from "@/core/shared/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tracking } = body;

    if (!tracking) {
      return NextResponse.json(
        { success: false, message: "tracking es requerido" },
        { status: 400 }
      );
    }

    logger.info("Getting shipment status", { tracking });

    const shipmentStatus = await AndreaniService.getShipmentStatus(tracking);

    return NextResponse.json({
      success: true,
      data: shipmentStatus,
    });
  } catch (error) {
    logger.error("Error getting shipment status", { error });

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error obteniendo estado",
      },
      { status: 500 }
    );
  }
}
