"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product, ProductCategory } from "../types/catalog";
import { IconArrow } from "./icons";
import { money } from "../lib/utils";

const KEY = "maaro-custom-products";

export function CatalogStudio() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState({ name: "", category: "T-Shirts" as ProductCategory, price: "", compareAt: "", description: "", sizes: "M, L, XL, XXL", colors: "Black, White", image: "", badge: "NEW STOCK" });
  const [preview, setPreview] = useState<string | null>(null);

  const save = (next: Product[]) => { setProducts(next); localStorage.setItem(KEY, JSON.stringify(next)); };
  const update = (key: keyof typeof form, value: string) => setForm((v) => ({ ...v, [key]: value }));

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image) return;
    const product: Product = {
      id: `custom-${Date.now()}`,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : undefined,
      description: form.description || "MAARO catalog item.",
      image: form.image,
      badge: form.badge || undefined,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
    };
    save([product, ...products]);
    setForm({ name: "", category: "T-Shirts", price: "", compareAt: "", description: "", sizes: "M, L, XL, XXL", colors: "Black, White", image: "", badge: "NEW STOCK" });
    setPreview(null);
  };

  const clearCatalog = () => { save([]); };

  const json = useMemo(() => JSON.stringify(products, null, 2), [products]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { const result = String(reader.result); update("image", result); setPreview(result); };
    reader.readAsDataURL(file);
  };

  return (
    <main className="admin-page">
      <div className="admin-top"><Link href="/" className="brand"><span className="brand-mark">M</span><span><strong>MAARO</strong><em>CATALOG STUDIO</em></span></Link><Link href="/shop" className="outline-button">OPEN SHOP <IconArrow size={16} /></Link></div>
      <div className="container admin-shell">
        <div className="admin-title"><div><div className="eyebrow">DEMO CONTENT MANAGER</div><h1>Catalog <i>Studio.</i></h1><p>Add product photos and stock details without touching code. This demo stores items in the browser only.</p></div><div className="admin-warning">PRODUCTION: connect Supabase Storage + Postgres before real multi-device use.</div></div>
        <div className="admin-grid">
          <form className="admin-form" onSubmit={addProduct}>
            <div className="eyebrow">NEW PRODUCT</div>
            <label>PRODUCT NAME<input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Premium Cotton Tee" /></label>
            <div className="form-grid"><label>CATEGORY<select value={form.category} onChange={(e) => update("category", e.target.value)}><option>T-Shirts</option><option>Shirts</option><option>Denim</option><option>Ethnic</option><option>Everyday</option></select></label><label>PRICE<input inputMode="numeric" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="299" /></label></div>
            <div className="form-grid"><label>COMPARE AT<input inputMode="numeric" value={form.compareAt} onChange={(e) => update("compareAt", e.target.value)} placeholder="399" /></label><label>BADGE<input value={form.badge} onChange={(e) => update("badge", e.target.value)} placeholder="NEW STOCK" /></label></div>
            <label>DESCRIPTION<textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Short product description" /></label>
            <label>SIZES<input value={form.sizes} onChange={(e) => update("sizes", e.target.value)} /></label>
            <label>COLOURS<input value={form.colors} onChange={(e) => update("colors", e.target.value)} /></label>
            <div className="upload-box"><input id="photo" type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} /><label htmlFor="photo"><span>UPLOAD PHOTO</span><small>or paste an image URL below</small></label>{preview && <img src={preview} alt="Preview" />}</div>
            <label>IMAGE URL<input value={form.image.startsWith("data:") ? "Uploaded image" : form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." /></label>
            <button className="primary-button full" type="submit">ADD TO DEMO CATALOG <IconArrow size={17} /></button>
          </form>
          <section className="admin-list"><div className="admin-list-head"><div><div className="eyebrow">BROWSER-LOCAL STOCK</div><h2>{products.length} custom items</h2></div><button className="danger-link" onClick={clearCatalog}>CLEAR ALL</button></div>{products.length === 0 ? <div className="admin-empty">No custom items yet. Add one on the left and open the Shop page.</div> : products.map((product) => <div className="admin-item" key={product.id}><img src={product.image} alt="" /><div><div className="eyebrow">{product.category}</div><strong>{product.name}</strong><span>{money(product.price)} · {product.sizes.join(" / ")}</span></div><button aria-label={`Delete ${product.name}`} onClick={() => save(products.filter((p) => p.id !== product.id))}>×</button></div>)}<details className="json-block"><summary>VIEW JSON</summary><pre>{json}</pre></details></section>
        </div>
      </div>
    </main>
  );
}
