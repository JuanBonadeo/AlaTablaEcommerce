import { NextResponse } from "next/server";
import { AndreaniService } from "@/core/shipments/andreani.service";
import { ShipmentDAO } from "@/core/shipments/shipment.dao";
import { OrderDAO } from "@/core/orders/order.dao";
import { logger } from "@/core/shared/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId es requerido" },
        { status: 400 }
      );
    }

    // Obtener orden y envío
    const order = await OrderDAO.getById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Orden no encontrada" },
        { status: 404 }
      );
    }

    const shipment = await ShipmentDAO.getByOrderId(orderId);
    if (!shipment) {
      return NextResponse.json(
        { success: false, message: "No hay envío asociado a esta orden" },
        { status: 404 }
      );
    }

    // Generate label using tracking number if available, otherwise use shipment ID
    const pdfBase64 = await AndreaniService.generateLabel(
      shipment.tracking || shipment.id
    );

    return NextResponse.json({
      success: true,
      data: { pdfBase64 },
    });
  } catch (error) {
    logger.error("Error generating shipping label", { error });

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error generando etiqueta",
      },
      { status: 500 }
    );
  }
}
