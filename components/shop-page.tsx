"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products as baseProducts } from "../lib/products";
import type { Product, ProductCategory } from "../types/catalog";
import { SiteHeader } from "./site-header";
import { ProductCard } from "./product-card";
import { CartDrawer } from "./cart-drawer";
import { OrderModal } from "./order-modal";
import { IconArrow } from "./icons";

const categories: ("ALL" | ProductCategory)[] = ["ALL", "T-Shirts", "Shirts", "Denim", "Ethnic", "Everyday"];

export function ShopPage() {
  const [active, setActive] = useState<(typeof categories)[number]>("ALL");
  const [sort, setSort] = useState("featured");
  const [customProducts, setCustomProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("maaro-custom-products");
      if (saved) setCustomProducts(JSON.parse(saved));
    } catch {
      setCustomProducts([]);
    }
  }, []);

  const allProducts = useMemo(() => [...customProducts, ...baseProducts], [customProducts]);
  const filtered = useMemo(() => {
    const result = active === "ALL" ? [...allProducts] : allProducts.filter((product) => product.category === active);
    if (sort === "price-low") return result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") return result.sort((a, b) => b.price - a.price);
    return result;
  }, [active, allProducts, sort]);

  return (
    <main>
      <SiteHeader />
      <section className="shop-hero container">
        <div><div className="eyebrow">THE MAARO CATALOG</div><h1>Pieces for <i>everyday.</i></h1></div>
        <p>Retail-friendly cuts. Wholesale-aware pricing. Current stock displayed here is illustrative for the demo; the team verifies live availability before dispatch.</p>
      </section>

      <section className="shop-toolbar container">
        <div className="category-scroll">{categories.map((category) => <button key={category} className={active === category ? "filter active" : "filter"} onClick={() => setActive(category)}>{category}</button>)}</div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort catalog"><option value="featured">SORT: FEATURED</option><option value="price-low">PRICE: LOW → HIGH</option><option value="price-high">PRICE: HIGH → LOW</option></select>
      </section>

      <section className="container shop-grid-wrap"><div className="result-line"><span>{filtered.length} PIECES</span><span>LIVE DEMO CATALOG</span></div><div className="product-grid shop-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>

      <section className="shop-cta"><div className="container shop-cta-inner"><div><div className="eyebrow">CAN’T FIND IT?</div><h2>Stock moves quickly.<br /><i>Ask the shop.</i></h2></div><a href="https://wa.me/917070080808?text=Hi%20MAARO%2C%20I%20want%20to%20ask%20about%20current%20stock." className="primary-button">ASK ON WHATSAPP <IconArrow size={18} /></a></div></section>
      <footer className="site-footer compact"><div className="container footer-bottom"><Link href="/">← HOME</Link><span>© 2026 MAARO BIHAR CLOTHING</span><Link href="/admin">CATALOG STUDIO ↗</Link></div></footer>
      <CartDrawer />
      <OrderModal />
    </main>
  );
}
