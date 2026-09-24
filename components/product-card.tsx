"use client";

import { useState } from "react";
import type { Product } from "../types/catalog";
import { money } from "../lib/utils";
import { useStore } from "./store-provider";
import { IconArrow } from "./icons";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);

  return (
    <>
      <article className="product-card">
        <button className="product-image" onClick={() => setOpen(true)} aria-label={`View ${product.name}`}>
          {product.badge && <span className="product-badge">{product.badge}</span>}
          <img src={product.image} alt={product.name} loading="lazy" />
          <span className="image-hover">VIEW <IconArrow size={15} /></span>
        </button>
        <div className="product-meta">
          <div>
            <div className="eyebrow">{product.category}</div>
            <h3>{product.name}</h3>
          </div>
          <div className="price-lockup">
            <strong>{money(product.price)}</strong>
            {product.compareAt && <del>{money(product.compareAt)}</del>}
          </div>
        </div>
        <button className="add-button" onClick={() => addToCart(product)}>
          ADD TO BAG <span>+</span>
        </button>
      </article>

      {open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={product.name} onMouseDown={() => setOpen(false)}>
          <div className="product-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
            <div className="modal-image"><img src={product.image} alt={product.name} /></div>
            <div className="modal-copy">
              <div className="eyebrow">{product.category} / {product.badge || "MAARO EDIT"}</div>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div className="modal-price">{money(product.price)} {product.compareAt && <del>{money(product.compareAt)}</del>}</div>
              <label>SIZE
                <div className="choice-row">{product.sizes.map((option) => <button key={option} className={size === option ? "choice active" : "choice"} onClick={() => setSize(option)}>{option}</button>)}</div>
              </label>
              <label>COLOUR
                <div className="choice-row">{product.colors.map((option) => <button key={option} className={color === option ? "choice active" : "choice"} onClick={() => setColor(option)}>{option}</button>)}</div>
              </label>
              <button className="primary-button" onClick={() => { addToCart(product, size, color); setOpen(false); }}>ADD TO BAG <IconArrow size={17} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
