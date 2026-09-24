"use client";

import Link from "next/link";
import { products } from "../lib/products";
import { money } from "../lib/utils";
import { SiteHeader } from "./site-header";
import { ProductCard } from "./product-card";
import { CartDrawer } from "./cart-drawer";
import { OrderModal } from "./order-modal";
import { IconArrow } from "./icons";

export function HomePage() {
  return (
    <main>
      <SiteHeader />
      <section className="hero container">
        <div className="hero-copy">
          <div className="hero-kicker"><span>PATNA / BIHAR</span><span>EST. 15+ YEARS OF SELLING</span></div>
          <h1>दिल्ली का रेट.<br /><i>अब पटना में.</i></h1>
          <p className="hero-lead">Men’s wear, everyday fashion and wholesale-ready stock — researched for the price-conscious Bihar market and brought closer to you.</p>
          <div className="hero-actions"><Link href="/shop" className="primary-button">SHOP THE CATALOG <IconArrow size={18} /></Link><a className="text-link" href="#story">MEET THE BRAND <span>↓</span></a></div>
          <div className="hero-note"><b>₹120–150</b><span>starting everyday basics</span><b>801105</b><span>Danapur, Patna</span></div>
        </div>
        <div className="hero-art">
          <div className="hero-red-panel"><span>MAARO / 01</span><strong>BIHAR<br />MADE<br /><em>FOR DAILY.</em></strong><small>MAARO BIHAR CLOTHING</small></div>
          <div className="hero-photo"><img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85" alt="Men's apparel collection" /></div>
          <span className="hero-caption">रोज़ पहनने वाला.<br />रोज़ खरीदने लायक.</span>
        </div>
      </section>

      <section className="ticker"><div className="container ticker-inner"><span>MEN’S WEAR</span><b>•</b><span>EVERYDAY ESSENTIALS</span><b>•</b><span>WHOLESALE & RETAIL</span><b>•</b><span>DANAPUR, PATNA</span><b>•</b><span>MEN’S WEAR</span></div></section>

      <section className="catalog-preview container" id="catalog">
        <div className="section-head"><div><div className="eyebrow">THE CURRENT EDIT</div><h2>Stock that makes sense.</h2></div><Link href="/shop" className="outline-button">VIEW ALL STOCK <IconArrow size={17} /></Link></div>
        <div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="split-story" id="story">
        <div className="story-image"><img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85" alt="Entrepreneur reviewing clothing stock" /><span>01 — THE PEOPLE</span></div>
        <div className="story-copy"><div className="eyebrow">BUILT IN PATNA / FOR BIHAR</div><h2>Fifteen years of finding the price, then finding the product.</h2><p>MAARO comes from a simple retail observation: customers shouldn’t have to travel across cities to get access to the rates and variety they see elsewhere.</p><p>The business is built around product research, fast stock movement and direct e-commerce selling — now brought together as a local fashion destination in Danapur.</p><div className="owner-signature"><span>FOUNDED BY</span><strong>THE MAARO TEAM</strong><em>Patna, Bihar</em></div></div>
      </section>

      <section className="wholesale" id="wholesale"><div className="container wholesale-inner"><div><div className="eyebrow">FOR RESELLERS / RETAILERS</div><h2>Need quantity?<br /><i>Talk wholesale.</i></h2></div><div className="wholesale-copy"><p>For local retailers, resellers and bulk buyers, the catalog can become a live stock-listing layer. Tell us the product, quantity and delivery point — the team will verify availability directly.</p><a className="dark-button" href="https://wa.me/917070080808?text=Hi%20MAARO%2C%20I%20want%20to%20ask%20about%20wholesale%20stock.">WHATSAPP WHOLESALE <IconArrow size={17} /></a></div></div></section>

      <section className="numbers container"><div><strong>15+</strong><span>YEARS IN<br />ECOMMERCE</span></div><div><strong>₹120</strong><span>ENTRY<br />POINT</span></div><div><strong>801105</strong><span>DANAPUR<br />PATNA</span></div><div><strong>1:1</strong><span>DIRECT<br />ORDERING</span></div></section>

      <section className="location" id="contact"><div className="location-panel"><div className="eyebrow">COME SEE THE STOCK</div><h2>Above Rudra Marriage Hall,<br /><i>Tribhuvan Modh.</i></h2><p>Mustafapur · Raut City · Saguna More Road<br />Jamsaut, Danapur, Patna — Bihar 801105</p><div className="contact-row"><a href="tel:+917070080808">+91 70700 80808</a><a href="tel:+919631234524">+91 96312 34524</a><a href="tel:+918292505050">+91 82925 05050</a></div></div><div className="location-map"><span>MAARO</span><div className="map-grid"></div><strong>25°34′ / 85°05′</strong><small>JAMSAUT, DANAPUR</small></div></section>

      <footer className="site-footer"><div className="container footer-grid"><div><div className="brand footer-brand"><span className="brand-mark">M</span><span><strong>MAARO</strong><em>BIHAR CLOTHING</em></span></div><p>दिल्ली का रेट. अब पटना में.</p></div><div className="footer-col"><span>EXPLORE</span><Link href="/shop">Shop</Link><a href="#story">Our Story</a><a href="#wholesale">Wholesale</a></div><div className="footer-col"><span>CONNECT</span><a href="https://www.instagram.com/maarobiharclothing/">Instagram</a><a href="https://www.facebook.com/">Facebook</a><a href="https://www.youtube.com/@maarobiharclothing">YouTube</a></div></div><div className="container footer-bottom"><span>© 2026 MAARO BIHAR CLOTHING</span><Link href="/admin">CATALOG STUDIO ↗</Link><span>DANAPUR / BIHAR</span></div></footer>

      <CartDrawer />
      <OrderModal />
    </main>
  );
}
