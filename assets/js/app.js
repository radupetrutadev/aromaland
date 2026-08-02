/* ==========================================================================
   Shared UI — header wiring, cart drawer, instant search, toasts.

   Loaded on every page. Everything here is progressive enhancement: the
   static HTML renders and is usable before this file runs.
   ========================================================================== */
(function (global) {
  "use strict";

  const { AL, Cart, Theme, ALArt } = global;

  /* ---- tiny helpers --------------------------------------------------- */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  /** Diacritic-insensitive compare — "lamaie" must find "lămâie". */
  function norm(s) {
    return String(s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  const money = AL.formatPrice;

  const ICONS = {
    search:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    cart:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
    plus:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    check:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>',
    close:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    menu:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    arrow:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    chevron:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    truck:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
    leaf:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-8 5-13 16-14 0 11-5 15-12 15H4z"/><path d="M9 16c1.5-4 4-6.5 7-8"/></svg>',
    shield:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.4-3 8-7 9-4-1-7-4.6-7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    back:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5 3 12l6 7"/><path d="M3 12h13a5 5 0 0 1 0 10h-1"/></svg>',
    sun:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>',
    moon:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>',
    lock:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    empty:
      '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
  };

  /* ---- product card --------------------------------------------------- */

  function badgeFor(p) {
    const out = [];
    if (p.stock === 0) out.push('<span class="badge badge-out">Stoc epuizat</span>');
    else if (p.old) {
      const pct = Math.round((1 - p.price / p.old) * 100);
      out.push(`<span class="badge badge-sale">-${pct}%</span>`);
    } else if (p.isNew) out.push('<span class="badge badge-new">Nou</span>');
    return out.length ? `<div class="badges">${out.join("")}</div>` : "";
  }

  function priceHtml(p, cls) {
    return `<div class="price ${p.old ? "is-sale" : ""} ${cls || ""}">
      <span class="now">${money(p.price)}</span>
      ${p.old ? `<span class="was">${money(p.old)}</span>` : ""}
    </div>`;
  }

  /**
   * Product card. Add-to-cart lives on the card itself so a shopper can go
   * from landing to a filled cart without ever opening a product page.
   */
  function renderCard(p) {
    const cat = AL.categoryOf(p);
    const out = p.stock === 0;
    return `<article class="card" data-product="${p.id}">
  <div class="card-art">${badgeFor(p)}${ALArt.productArt(p)}</div>
  <div class="card-body">
    <span class="card-cat">${esc(cat.name)}</span>
    <h3 class="card-name"><a href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3>
    <div class="rating"><span class="stars" aria-hidden="true">${AL.stars(p.rating)}</span>
      <span class="sr-only">${p.rating} din 5</span>(${p.reviews})</div>
    <div class="card-foot">
      ${priceHtml(p)}
      ${
        out
          ? ""
          : `<button class="add-btn" data-add="${p.id}" aria-label="Adaugă ${esc(p.name)} în coș">
               <span class="pl">${ICONS.plus}</span><span class="ck">${ICONS.check}</span>
             </button>`
      }
    </div>
  </div>
</article>`;
  }

  /* ---- toasts --------------------------------------------------------- */

  let toastHost;

  function toast(message, actionHtml) {
    if (!toastHost) {
      toastHost = el('<div class="toast-host" role="status" aria-live="polite"></div>');
      document.body.appendChild(toastHost);
    }
    const node = el(
      `<div class="toast">${ICONS.check}<span>${esc(message)}</span>${actionHtml || ""}</div>`
    );
    toastHost.appendChild(node);
    setTimeout(() => {
      node.classList.add("is-out");
      setTimeout(() => node.remove(), 220);
    }, 3200);
  }

  /* ---- focus management ----------------------------------------------- */

  let lastFocused = null;

  function lockScroll(on) {
    document.body.classList.toggle("is-locked", on);
  }

  /** Build a selector that can find this node again after a re-render. */
  function attrSelector(node) {
    const parts = [];
    ["data-qty", "data-key", "data-remove", "data-add"].forEach((a) => {
      const v = node.getAttribute && node.getAttribute(a);
      if (v !== null && v !== undefined) parts.push(`[${a}="${v.replace(/"/g, '\\"')}"]`);
    });
    return parts.length ? parts.join("") : null;
  }

  /**
   * Re-render a live region without dropping keyboard focus. Cart mutations
   * replace the markup wholesale, which would otherwise send focus back to
   * <body> and break both Escape-to-close and repeated qty presses.
   */
  function withFocusRestore(container, render) {
    const active = document.activeElement;
    const inside = active && container.contains(active);
    const sel = inside ? attrSelector(active) : null;

    render();

    if (!inside) return;
    const next = sel && container.querySelector(sel);
    if (next && !next.disabled) {
      next.focus();
      return;
    }
    const fallback = container.querySelector(
      'button:not([disabled]), a[href], input, select, textarea'
    );
    if (fallback) fallback.focus();
  }

  function trapFocus(container, event) {
    const focusables = $$(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      container
    ).filter((n) => n.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ---- cart drawer ---------------------------------------------------- */

  let drawer, scrim;

  function buildDrawer() {
    scrim = el('<div class="scrim" data-drawer-close></div>');
    drawer = el(`<aside class="drawer" role="dialog" aria-modal="true" aria-label="Coșul tău" aria-hidden="true">
  <div class="drawer-head">
    <h2>Coșul tău</h2>
    <button class="icon-btn" data-drawer-close aria-label="Închide coșul">${ICONS.close}</button>
  </div>
  <div class="drawer-body"></div>
  <div class="drawer-foot"></div>
</aside>`);
    document.body.append(scrim, drawer);

    scrim.addEventListener("click", closeDrawer);
    drawer.addEventListener("click", (e) => {
      if (e.target.closest("[data-drawer-close]")) closeDrawer();
    });
    // Escape is handled once, at document level (see init).
    drawer.addEventListener("keydown", (e) => {
      if (e.key === "Tab") trapFocus(drawer, e);
    });
  }

  function shipBarHtml() {
    const remaining = Cart.remainingForFreeShipping();
    const pct = Math.min(
      100,
      (Cart.subtotal() / AL.FREE_SHIPPING_THRESHOLD) * 100
    );
    return `<div class="ship-bar ${remaining === 0 ? "is-free" : ""}">
      <div class="track"><div class="fill" style="width:${pct}%"></div></div>
      <p class="msg">${
        remaining === 0
          ? "Transport gratuit inclus 🎉"
          : `Mai adaugă <strong>${money(remaining)}</strong> pentru transport gratuit`
      }</p>
    </div>`;
  }

  function lineHtml(l) {
    return `<div class="line" data-line="${l.key}">
  <div class="line-art">${ALArt.productArt(l.product)}</div>
  <div>
    <a class="line-name" href="product.html?id=${encodeURIComponent(l.id)}">${esc(l.product.name)}</a>
    ${l.size ? `<div class="line-variant">${esc(l.size)}</div>` : ""}
    <div class="line-bottom">
      <div class="qty">
        <button data-qty="-1" data-key="${l.key}" aria-label="Scade cantitatea">−</button>
        <output aria-label="Cantitate">${l.qty}</output>
        <button data-qty="1" data-key="${l.key}" aria-label="Crește cantitatea"
          ${l.qty >= Cart.MAX_QTY ? "disabled" : ""}>+</button>
      </div>
      <span class="line-price">${money(l.total)}</span>
    </div>
    <button class="line-remove" data-remove="${l.key}">Elimină</button>
  </div>
</div>`;
  }

  function renderDrawer() {
    if (!drawer) return;
    withFocusRestore(drawer, paintDrawer);
  }

  function paintDrawer() {
    const body = $(".drawer-body", drawer);
    const foot = $(".drawer-foot", drawer);
    const ls = Cart.lines();

    if (!ls.length) {
      body.innerHTML = `<div class="empty-state">
        <div class="es-icon">${ICONS.empty}</div>
        <h3>Coșul este gol</h3>
        <p>Adaugă un produs și te aducem înapoi aici.</p>
        <a class="btn btn-primary" href="catalog.html">Vezi produsele</a>
      </div>`;
      foot.innerHTML = "";
      foot.hidden = true;
      return;
    }

    foot.hidden = false;
    body.innerHTML = ls.map(lineHtml).join("");
    foot.innerHTML = `${shipBarHtml()}
      <div class="total-row"><span class="t-label">Subtotal</span><span class="t-value">${money(
        Cart.subtotal()
      )}</span></div>
      <a class="btn btn-primary btn-lg btn-block" href="checkout.html">Finalizează comanda</a>
      <a class="btn btn-ghost btn-block" href="cart.html">Vezi coșul</a>`;
  }

  function openDrawer() {
    if (!drawer) buildDrawer();
    renderDrawer();
    lastFocused = document.activeElement;
    scrim.classList.add("is-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    lockScroll(true);
    const focusTarget = $("[data-drawer-close]", drawer);
    if (focusTarget) focusTarget.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    scrim.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    lockScroll(false);
    if (lastFocused) lastFocused.focus();
  }

  /* ---- instant search -------------------------------------------------- */

  let searchOverlay, searchInput, searchResults, activeIndex = -1, matches = [];

  function buildSearch() {
    const popular = ["lavandă", "difuzor", "vanilie", "reed diffuser", "cadou"];
    searchOverlay = el(`<div class="search-overlay" role="dialog" aria-modal="true" aria-label="Caută produse">
  <div class="search-panel">
    <div class="sp-input">
      ${ICONS.search}
      <input type="search" id="al-search" placeholder="Caută produse, arome, categorii…"
        autocomplete="off" spellcheck="false" aria-label="Caută produse"
        role="combobox" aria-expanded="false" aria-controls="al-search-results">
      <button class="btn btn-sm btn-ghost" data-search-close>Esc</button>
    </div>
    <div class="search-results" id="al-search-results" role="listbox" aria-label="Rezultate"></div>
    <div class="search-quick">
      <p class="eyebrow">Căutări populare</p>
      <div class="chips">${popular
        .map((q) => `<button class="chip" data-q="${esc(q)}">${esc(q)}</button>`)
        .join("")}</div>
    </div>
    <div class="search-hint">
      <span>↑↓ navighează</span><span>↵ deschide</span><span>Esc închide</span>
    </div>
  </div>
</div>`);
    document.body.appendChild(searchOverlay);
    searchInput = $("input", searchOverlay);
    searchResults = $(".search-results", searchOverlay);

    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay || e.target.closest("[data-search-close]"))
        closeSearch();
      const chip = e.target.closest("[data-q]");
      if (chip) {
        searchInput.value = chip.dataset.q;
        runSearch();
        searchInput.focus();
      }
    });

    searchInput.addEventListener("input", runSearch);
    searchOverlay.addEventListener("keydown", onSearchKey);
  }

  function score(p, q) {
    const name = norm(p.name);
    const cat = norm(AL.categoryOf(p).name);
    const tags = norm((p.tags || []).join(" "));
    if (name.startsWith(q)) return 100;
    if (name.includes(" " + q)) return 80;
    if (name.includes(q)) return 60;
    if (tags.includes(q)) return 40;
    if (cat.includes(q)) return 30;
    if (norm(p.desc || "").includes(q)) return 15;
    return 0;
  }

  function runSearch() {
    const raw = searchInput.value.trim();
    const q = norm(raw);
    const quick = $(".search-quick", searchOverlay);
    activeIndex = -1;

    if (!q) {
      matches = [];
      searchResults.innerHTML = "";
      quick.hidden = false;
      searchInput.setAttribute("aria-expanded", "false");
      return;
    }

    quick.hidden = true;
    matches = AL.products
      .map((p) => ({ p, s: score(p, q) }))
      .filter((m) => m.s > 0)
      .sort((a, b) => b.s - a.s || b.p.rating - a.p.rating)
      .slice(0, 8)
      .map((m) => m.p);

    searchInput.setAttribute("aria-expanded", matches.length ? "true" : "false");

    if (!matches.length) {
      searchResults.innerHTML = `<p class="search-empty">Niciun rezultat pentru „${esc(
        raw
      )}”.<br><a class="link-arrow" href="catalog.html">Vezi toate produsele ${ICONS.arrow}</a></p>`;
      return;
    }

    searchResults.innerHTML = matches
      .map(
        (p, i) => `<a class="sr-item" role="option" id="al-sr-${i}" aria-selected="false"
       href="product.html?id=${encodeURIComponent(p.id)}">
  <span class="thumb">${ALArt.productArt(p)}</span>
  <span>
    <span class="sr-name">${esc(p.name)}</span>
    <span class="sr-meta">${esc(AL.categoryOf(p).name)}</span>
  </span>
  <span class="sr-price">${money(p.price)}</span>
</a>`
      )
      .join("");
  }

  function highlight(i) {
    const items = $$(".sr-item", searchResults);
    items.forEach((n, idx) => {
      const on = idx === i;
      n.classList.toggle("is-active", on);
      n.setAttribute("aria-selected", String(on));
    });
    if (items[i]) {
      items[i].scrollIntoView({ block: "nearest" });
      searchInput.setAttribute("aria-activedescendant", "al-sr-" + i);
    }
  }

  function onSearchKey(e) {
    if (e.key === "Tab") return trapFocus(searchOverlay, e);
    if (!matches.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % matches.length;
      highlight(activeIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + matches.length) % matches.length;
      highlight(activeIndex);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      location.href =
        "product.html?id=" + encodeURIComponent(matches[activeIndex].id);
    }
  }

  function openSearch() {
    if (!searchOverlay) buildSearch();
    lastFocused = document.activeElement;
    searchOverlay.classList.add("is-open");
    lockScroll(true);
    searchInput.focus();
    searchInput.select();
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("is-open");
    lockScroll(false);
    if (lastFocused) lastFocused.focus();
  }

  /* ---- mobile menu ----------------------------------------------------- */

  let mobileMenu;

  function buildMobileMenu() {
    mobileMenu = el(`<div class="mobile-menu" role="dialog" aria-modal="true" aria-label="Meniu">
  <div class="wrap">
    <div class="mm-head">
      <span class="logo"><span class="mark">${leafMark()}</span> Aroma Land</span>
      <button class="icon-btn" data-menu-close aria-label="Închide meniul">${ICONS.close}</button>
    </div>
    <nav>
      <a href="catalog.html"><span>Toate produsele</span>${ICONS.chevron}</a>
      ${AL.categories
        .map(
          (c) =>
            `<a href="catalog.html?cat=${c.slug}"><span>${esc(c.name)}</span>${ICONS.chevron}</a>`
        )
        .join("")}
    </nav>
    <div class="mm-foot">
      <a href="catalog.html?sort=discount">Oferte speciale</a>
      <a href="info.html#livrare">Livrare și retur</a>
      <a href="info.html#contact">Contact</a>
    </div>
  </div>
</div>`);
    document.body.appendChild(mobileMenu);
    mobileMenu.addEventListener("click", (e) => {
      if (e.target.closest("[data-menu-close]")) closeMenu();
    });
    mobileMenu.addEventListener("keydown", (e) => {
      if (e.key === "Tab") trapFocus(mobileMenu, e);
    });
  }

  function leafMark() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-8 5-13 16-14 0 11-5 15-12 15H4z"/><path d="M9 16c1.5-4 4-6.5 7-8"/></svg>';
  }

  function openMenu() {
    if (!mobileMenu) buildMobileMenu();
    lastFocused = document.activeElement;
    mobileMenu.classList.add("is-open");
    lockScroll(true);
    const btn = $("[data-menu-close]", mobileMenu);
    if (btn) btn.focus();
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    lockScroll(false);
    if (lastFocused) lastFocused.focus();
  }

  /* ---- add to cart (delegated across every page) ----------------------- */

  function handleAdd(btn) {
    const id = btn.dataset.add;
    const product = AL.get(id);
    if (!product) return;
    Cart.add(id, btn.dataset.size || null, Number(btn.dataset.qty) || 1);

    btn.classList.add("is-added");
    setTimeout(() => btn.classList.remove("is-added"), 1200);

    toast(
      `${product.name} — adăugat`,
      '<a href="checkout.html">Finalizează</a>'
    );
  }

  /* ---- prefetch on intent --------------------------------------------- */

  const prefetched = new Set();

  function prefetch(href) {
    if (!href || prefetched.has(href)) return;
    prefetched.add(href);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
  }

  /* ---- boot ------------------------------------------------------------ */

  function syncCartCount() {
    const n = Cart.count();
    $$("[data-cart-count]").forEach((node) => {
      const had = node.textContent;
      node.textContent = n;
      node.classList.toggle("is-visible", n > 0);
      if (had !== String(n) && n > 0) {
        node.classList.remove("is-bump");
        void node.offsetWidth; // restart the animation
        node.classList.add("is-bump");
      }
    });
  }

  function initTheme() {
    Theme.apply(Theme.get());
    const mq = global.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", () => {
      if (Theme.get() === "auto") Theme.apply("auto");
    });
    $$("[data-theme-toggle]").forEach((btn) => {
      btn.innerHTML = ICONS.sun + ICONS.moon;
      btn.addEventListener("click", () => Theme.toggle());
    });
  }

  function init() {
    initTheme();

    // Header controls
    $$("[data-open-search]").forEach((b) =>
      b.addEventListener("click", openSearch)
    );
    $$("[data-open-cart]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        openDrawer();
      })
    );
    $$("[data-open-menu]").forEach((b) => b.addEventListener("click", openMenu));

    // Global delegation: add-to-cart, qty steppers, remove
    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) {
        e.preventDefault();
        handleAdd(add);
        return;
      }
      const qty = e.target.closest("[data-qty]");
      if (qty) {
        const line = Cart.lines().find((l) => l.key === qty.dataset.key);
        if (line) Cart.setQty(line.key, line.qty + Number(qty.dataset.qty));
        return;
      }
      const rm = e.target.closest("[data-remove]");
      if (rm) {
        Cart.remove(rm.dataset.remove);
      }
    });

    // Keyboard: Cmd/Ctrl+K or "/" opens search; Escape closes the top overlay.
    // Escape is handled at document level because re-rendering an overlay can
    // move focus outside it, which would strand a container-scoped listener.
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (searchOverlay && searchOverlay.classList.contains("is-open")) return closeSearch();
        if (mobileMenu && mobileMenu.classList.contains("is-open")) return closeMenu();
        if (drawer && drawer.classList.contains("is-open")) return closeDrawer();
        return;
      }
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(
        (document.activeElement || {}).tagName || ""
      );
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        openSearch();
      }
    });

    // Warm up the next likely page on hover/touch
    document.addEventListener(
      "pointerover",
      (e) => {
        const a = e.target.closest('a[href$=".html"], a[href*=".html?"]');
        if (a && a.origin === location.origin) prefetch(a.href);
      },
      { passive: true }
    );

    Cart.subscribe(() => {
      syncCartCount();
      renderDrawer();
    });

    // Mark the current nav item
    const here = location.pathname.split("/").pop() || "index.html";
    $$(".nav a").forEach((a) => {
      if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.UI = {
    $, $$, el, esc, norm, money, ICONS,
    renderCard, priceHtml, badgeFor, withFocusRestore,
    toast, openDrawer, closeDrawer, openSearch,
  };
})(window);
