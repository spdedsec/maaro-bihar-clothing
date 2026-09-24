"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "./store-provider";
import { IconBag, IconMenu, IconMoon, IconSun, IconX } from "./icons";
import { cartCount } from "../lib/utils";

export function SiteHeader() {
  const { items, setCartOpen, dark, toggleTheme } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = cartCount(items);

  return (
    <header className="site-header">
      <div className="announcement">DELHI KA RATE • AB PATNA MEIN <span>/</span> पुरुषों का रोज़ का स्टाइल</div>
      <div className="header-main container">
        <Link href="/" className="brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">M</span>
          <span><strong>MAARO</strong><em>BIHAR CLOTHING</em></span>
        </Link>

        <nav className={`nav ${mobileOpen ? "nav-open" : ""}`}>
          <Link href="/shop" onClick={() => setMobileOpen(false)}>SHOP</Link>
          <a href="/#story" onClick={() => setMobileOpen(false)}>OUR STORY</a>
          <a href="/#wholesale" onClick={() => setMobileOpen(false)}>WHOLESALE</a>
          <a href="/#contact" onClick={() => setMobileOpen(false)}>CONTACT</a>
        </nav>

        <div className="header-actions">
          <button className="icon-button" aria-label="Toggle theme" onClick={toggleTheme}>{dark ? <IconSun /> : <IconMoon />}</button>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label="Open bag">
            <IconBag /><span className="bag-label">BAG</span>{count > 0 && <b>{count}</b>}
          </button>
          <button className="mobile-menu" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>{mobileOpen ? <IconX /> : <IconMenu />}</button>
        </div>
      </div>
    </header>
  );
}
