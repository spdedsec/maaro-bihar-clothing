"use client";

import { useState } from "react";
import { useStore } from "./store-provider";
import { cartTotal, money, waLink } from "../lib/utils";
import { IconArrow, IconX } from "./icons";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917070080808";

export function OrderModal() {
  const { items, orderOpen, setOrderOpen, clearCart } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "Patna", pincode: "", note: "" });

  if (!orderOpen) return null;

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);

    const order = {
      customer: form,
      items: items.map((item) => ({ id: item.product.id, name: item.product.name, category: item.product.category, price: item.product.price, quantity: item.quantity, size: item.size, color: item.color })),
      total: cartTotal(items),
    };

    try {
      await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) });
    } catch {
      // WhatsApp remains the source-of-truth handoff for the sales team.
    }

    const lines = [
      "MAARO BIHAR CLOTHING — NEW ORDER REQUEST",
      `Customer: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}, ${form.city} ${form.pincode}`,
      "",
      ...items.map((item, i) => `${i + 1}. ${item.product.name} — ${item.quantity} pc — Size ${item.size} — ${item.color} — ${money(item.product.price * item.quantity)}`),
      "",
      `Estimated total: ${money(cartTotal(items))}`,
      form.note ? `Note: ${form.note}` : "",
      "Please confirm availability, final delivery charge and delivery time.",
    ].filter(Boolean);

    window.location.href = waLink(WA_NUMBER, lines.join("\n"));
    setSubmitted(true);
    setLoading(false);
    clearCart();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Place MAARO order">
      <div className="order-modal">
        <div className="order-side">
          <div className="eyebrow">DIRECT SALES • PATNA</div>
          <h2>Tell us where the clothes should go.</h2>
          <p>Send the request to MAARO on WhatsApp. The team verifies stock, confirms the final amount and arranges delivery.</p>
          <div className="order-summary">{items.map((item) => <div key={`${item.product.id}-${item.size}-${item.color}`}><span>{item.quantity} × {item.product.name}</span><strong>{money(item.product.price * item.quantity)}</strong></div>)}<hr /><div><span>TOTAL</span><strong>{money(cartTotal(items))}</strong></div></div>
          <div className="dev-note">Demo flow: UI → /api/order → optional webhook → WhatsApp.</div>
        </div>
        <form className="order-form" onSubmit={submit}>
          <button type="button" className="modal-close" onClick={() => setOrderOpen(false)} aria-label="Close"><IconX /></button>
          <div className="eyebrow">DELIVERY DETAILS</div>
          <h3>Place order</h3>
          <div className="form-grid">
            <label>FULL NAME<input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" /></label>
            <label>PHONE NUMBER<input required inputMode="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91" /></label>
            <label className="span-2">ADDRESS<input required value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="House / street / landmark" /></label>
            <label>CITY<input required value={form.city} onChange={(e) => update("city", e.target.value)} /></label>
            <label>PINCODE<input required inputMode="numeric" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="801105" /></label>
            <label className="span-2">NOTE (OPTIONAL)<textarea value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="Size preference, delivery note, wholesale quantity etc." /></label>
          </div>
          <button className="primary-button full" disabled={loading || submitted} type="submit">{loading ? "PREPARING WHATSAPP…" : submitted ? "ORDER SENT" : "CONTINUE TO WHATSAPP"} <IconArrow size={17} /></button>
          <p className="tiny-copy">No online payment is taken in this demo. A MAARO team member confirms availability and payment/delivery details manually.</p>
        </form>
      </div>
    </div>
  );
}
