import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.customer?.name || !body?.customer?.phone || !body?.customer?.address) {
      return NextResponse.json({ ok: false, error: "Missing customer details" }, { status: 400 });
    }

    const order = {
      ...body,
      id: `MB-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    const webhookUrl = process.env.ORDER_WEBHOOK_URL;
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.ORDER_WEBHOOK_SECRET
            ? { "x-maaro-secret": process.env.ORDER_WEBHOOK_SECRET }
            : {}),
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        console.error("MAARO order webhook failed", response.status);
      }
    }

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    console.error("MAARO order API error", error);
    return NextResponse.json({ ok: false, error: "Unable to create order" }, { status: 500 });
  }
}
