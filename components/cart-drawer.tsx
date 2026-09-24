"use client";

import { useEffect } from "react";
import { useStore } from "./store-provider";
import { cartTotal, money } from "../lib/utils";
import { IconMinus, IconPlus, IconX } from "./icons";

export function CartDrawer() {
  const { items, cartOpen, setCartOpen, updateQuantity, removeFromCart, setOrderOpen } = useStore();
  const total = cartTotal(items);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="drawer-layer" onMouseDown={() => setCartOpen(false)}>
      <aside className="cart-drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="drawer-head"><div><div className="eyebrow">YOUR SELECTION</div><h2>Bag <span>{items.length ? `(${items.length})` : ""}</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><IconX /></button></div>
        <div className="drawer-body">
          {!items.length ? (
            <div className="empty-cart"><div className="empty-mark">०</div><h3>Your bag is quiet.</h3><p>Add a few pieces. We’ll take care of the rest on WhatsApp.</p><button className="primary-button" onClick={() => setCartOpen(false)}>BROWSE SHOP</button></div>
          ) : items.map((item) => (
            <div className="cart-line" key={`${item.product.id}-${item.size}-${item.color}`}>
              <img src={item.product.image} alt="" />
              <div className="cart-line-copy"><div className="eyebrow">{item.product.category}</div><strong>{item.product.name}</strong><span>{item.color} / {item.size}</span><div className="cart-controls"><button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}><IconMinus size={14} /></button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}><IconPlus size={14} /></button><button className="remove" onClick={() => removeFromCart(item.product.id, item.size, item.color)}>REMOVE</button></div></div>
              <strong>{money(item.product.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
        {items.length > 0 && <div className="drawer-foot"><div className="total-row"><span>ESTIMATED TOTAL</span><strong>{money(total)}</strong></div><p>Final availability and delivery details are confirmed by the MAARO team on WhatsApp.</p><button className="primary-button full" onClick={() => { setCartOpen(false); setOrderOpen(true); }}>PLACE ORDER ON WHATSAPP <span>↗</span></button></div>}
      </aside>
    </div>
  );
}
