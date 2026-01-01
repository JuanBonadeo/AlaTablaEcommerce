import { NextResponse } from "next/server";
import { CorreoArgentinoService } from "@/core/shipments/correo-argentino.service";
import { ShipmentDAO } from "@/core/shipments/shipment.dao";
import { ResponseHandler } from "@/core/shared/responseHandler";
import { logger } from "@/core/shared/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body?.orderId as string | undefined;

    if (!orderId) {
      return NextResponse.json({ success: false, message: "orderId es requerido" }, { status: 400 });
    }

    const shipment = await ShipmentDAO.getByOrderId(orderId);

    if (!shipment || !shipment.order) {
      return NextResponse.json({ success: false, message: "Envío no encontrado para la orden" }, { status: 404 });
    }

    const address = shipment.order.address;
    if (!address) {
      return NextResponse.json(
        { success: false, message: "La orden no tiene dirección asociada" },
        { status: 400 }
      );
    }

    const recipientName = `${address.firstName ?? ""} ${address.lastName ?? ""}`.trim() || "Destinatario";
    const recipientAddress = [address.street].filter(Boolean).join(" ") || "";

    const pdfBase64 = await CorreoArgentinoService.generateLabelPdf({
      orderId,
      shipmentId: shipment.id,
      recipient: {
        name: recipientName,
        address: recipientAddress,
        city: address.city ?? "",
        state: address.state ?? null,
        zip: address.zip ?? null,
        phone: address.phone ?? null,
      },
    });

    return NextResponse.json(ResponseHandler.success({ pdfBase64 }, "Etiqueta generada"));
  } catch (error) {
    logger.error("Error al generar etiqueta", { error });
    return NextResponse.json({ success: false, message: "No se pudo generar la etiqueta" }, { status: 500 });
  }
}
