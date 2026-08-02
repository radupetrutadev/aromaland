/* ==========================================================================
   Product detail page.

   Two paths to purchase: "Adaugă în coș" (stay and keep browsing) and
   "Cumpără acum" (straight to checkout, skipping the cart entirely).
   ========================================================================== */
(function () {
  "use strict";

  const { AL, UI, Cart, ALArt } = window;
  const { $, esc, money } = UI;

  const id = new URLSearchParams(location.search).get("id");
  const product = id ? AL.get(id) : null;
  const root = $("#pdp-root");

  if (!product) {
    root.innerHTML = `<div class="empty-state">
      <h3>Produsul nu a fost găsit</h3>
      <p>Poate a fost redenumit sau scos din catalog.</p>
      <a class="btn btn-primary" href="catalog.html">Vezi catalogul</a>
    </div>`;
    document.body.classList.remove("has-buybar");
    return;
  }

  const cat = AL.categoryOf(product);
  let size = product.sizes ? product.sizes[0].label : null;
  let qty = 1;

  document.title = product.name + " — Aroma Land Shop";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", product.desc);

  $("#crumb-cat").textContent = cat.name;
  $("#crumb-cat").href = "catalog.html?cat=" + cat.slug;
  $("#crumb-name").textContent = product.name;

  /* ---- structured data — real value for a shop, costs nothing ---- */
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.desc,
    category: cat.name,
    brand: { "@type": "Brand", name: "Aroma Land" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "RON",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  });
  document.head.appendChild(ld);

  /* ---- helpers -------------------------------------------------------- */

  function currentPrice() {
    return AL.priceOf(product, size);
  }

  function currentOldPrice() {
    return AL.oldPriceOf(product, size);
  }

  function stockHtml() {
    if (product.stock === 0)
      return '<span class="stock is-out"><span class="dot"></span> Stoc epuizat</span>';
    if (product.stock <= 10)
      return `<span class="stock is-low"><span class="dot"></span> Ultimele ${product.stock} bucăți</span>`;
    return '<span class="stock"><span class="dot"></span> În stoc, livrare în 24–48h</span>';
  }

  /* ---- render ---------------------------------------------------------- */

  root.innerHTML = `<div class="pdp">
  <div class="pdp-art">${ALArt.productArt(product)}</div>

  <div class="pdp-info">
    <div>
      <p class="eyebrow">${esc(cat.name)}</p>
      <h1 class="pdp-title">${esc(product.name)}</h1>
      <div class="rating" style="margin-top:8px">
        <span class="stars" aria-hidden="true">${AL.stars(product.rating)}</span>
        <span class="sr-only">${product.rating} din 5</span>
        <span>${product.rating.toFixed(1)} · ${product.reviews} recenzii</span>
      </div>
    </div>

    <div class="pdp-price ${product.old ? "is-sale" : ""}">
      <span class="now" id="pdp-now">${money(currentPrice())}</span>
      ${product.old ? '<span class="was" id="pdp-was"></span><span class="save" id="pdp-save"></span>' : ""}
    </div>

    <p class="pdp-desc">${esc(product.desc)}</p>

    ${
      product.sizes
        ? `<div class="variant-row">
             <span class="label" style="margin:0">Cantitate per flacon</span>
             <div class="variant-opts" id="sizes">
               ${product.sizes
                 .map(
                   (s, i) =>
                     `<button data-size="${esc(s.label)}" aria-pressed="${i === 0}">${esc(
                       s.label
                     )}</button>`
                 )
                 .join("")}
             </div>
           </div>`
        : ""
    }

    <div id="stock-line">${stockHtml()}</div>

    ${
      product.stock > 0
        ? `<div class="buy-row">
             <div class="qty">
               <button id="q-minus" aria-label="Scade cantitatea" disabled>−</button>
               <output id="q-val" aria-label="Cantitate">1</output>
               <button id="q-plus" aria-label="Crește cantitatea">+</button>
             </div>
             <button class="btn btn-primary btn-lg" id="pdp-add">Adaugă în coș</button>
             <button class="btn btn-ghost btn-lg" id="pdp-buy">Cumpără acum</button>
           </div>`
        : `<a class="btn btn-ghost btn-lg" href="catalog.html?cat=${cat.slug}">Vezi alternative din ${esc(
            cat.name
          )}</a>`
    }

    <ul class="pdp-facts reset">
      <li>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>
        <span><span class="f-title">Livrare 24–48h prin curier</span>
        <span class="f-sub">Gratuit peste 250 lei · ${money(AL.COURIER_FEE)} sub prag</span></span>
      </li>
      <li>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5 3 12l6 7"/><path d="M3 12h13a5 5 0 0 1 0 10h-1"/></svg>
        <span><span class="f-title">Retur în 30 de zile</span>
        <span class="f-sub">Banii înapoi pe același card, fără explicații.</span></span>
      </li>
      <li>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-8 5-13 16-14 0 11-5 15-12 15H4z"/><path d="M9 16c1.5-4 4-6.5 7-8"/></svg>
        <span><span class="f-title">De la producător</span>
        <span class="f-sub">Compus și îmbuteliat în fabrica Aroma Land.</span></span>
      </li>
    </ul>

    <div class="accordion">
      <details open>
        <summary>Detalii</summary>
        <div class="acc-body">
          <ul>${(product.notes || []).map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
        </div>
      </details>
      <details>
        <summary>Mod de utilizare</summary>
        <div class="acc-body">${esc(product.usage || "")}</div>
      </details>
      <details>
        <summary>Livrare și retur</summary>
        <div class="acc-body">
          Livrăm prin curier în 24–48h lucrătoare, oriunde în România. Transportul este
          gratuit pentru comenzile de peste ${money(AL.FREE_SHIPPING_THRESHOLD)}; sub acest prag costă
          ${money(AL.COURIER_FEE)}. Poți alege și ridicarea personală din magazin, fără cost.
          Ai 30 de zile să returnezi produsul; dacă ai plătit cu cardul, primești banii
          înapoi pe același card.
        </div>
      </details>
    </div>
  </div>
</div>`;

  /* ---- interaction ----------------------------------------------------- */

  const bbName = $("#bb-name");
  const bbPrice = $("#bb-price");
  const buyBar = $("#buy-bar");
  bbName.textContent = product.name;

  function syncPrice() {
    const unit = currentPrice();
    $("#pdp-now").textContent = money(unit);
    bbPrice.textContent = money(unit * qty);

    const was = $("#pdp-was");
    if (was) {
      const oldUnit = currentOldPrice();
      was.textContent = money(oldUnit);
      $("#pdp-save").textContent =
        "Economisești " + Math.round((1 - unit / oldUnit) * 100) + "%";
    }
  }

  const sizesEl = $("#sizes");
  if (sizesEl) {
    sizesEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-size]");
      if (!btn) return;
      size = btn.dataset.size;
      Array.from(sizesEl.children).forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn))
      );
      syncPrice();
    });
  }

  const minus = $("#q-minus");
  const plus = $("#q-plus");
  if (minus && plus) {
    const setQty = (n) => {
      qty = Math.min(Math.max(n, 1), Cart.MAX_QTY);
      $("#q-val").textContent = qty;
      minus.disabled = qty <= 1;
      plus.disabled = qty >= Cart.MAX_QTY;
      syncPrice();
    };
    minus.addEventListener("click", () => setQty(qty - 1));
    plus.addEventListener("click", () => setQty(qty + 1));
  }

  const addBtn = $("#pdp-add");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      Cart.add(product.id, size, qty);
      UI.toast(`${product.name} — adăugat`, '<a href="checkout.html">Finalizează</a>');
      UI.openDrawer();
    });
  }

  const buyBtn = $("#pdp-buy");
  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      Cart.add(product.id, size, qty);
      location.href = "checkout.html";
    });
  }

  const bbAdd = $("#bb-add");
  if (bbAdd) {
    if (product.stock === 0) {
      bbAdd.disabled = true;
      bbAdd.textContent = "Stoc epuizat";
    } else {
      bbAdd.addEventListener("click", () => {
        Cart.add(product.id, size, qty);
        UI.toast(`${product.name} — adăugat`, '<a href="checkout.html">Finalizează</a>');
        UI.openDrawer();
      });
    }
  }

  syncPrice();

  /* Reveal the mobile buy bar once the inline buy row scrolls out of view. */
  const anchor = $(".buy-row") || $(".pdp-price");
  if (anchor && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        const show = !entry.isIntersecting;
        buyBar.classList.toggle("is-visible", show);
        buyBar.setAttribute("aria-hidden", String(!show));
      },
      { rootMargin: "-70px 0px 0px 0px" }
    ).observe(anchor);
  } else {
    buyBar.classList.add("is-visible");
    buyBar.setAttribute("aria-hidden", "false");
  }

  /* ---- related --------------------------------------------------------- */

  const related = AL.products
    .filter((p) => p.id !== product.id && p.stock > 0)
    .map((p) => {
      let s = 0;
      if (p.cat === product.cat) s += 3;
      const shared = (p.tags || []).filter((t) => (product.tags || []).includes(t)).length;
      s += shared * 2;
      return { p, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.p.rating - a.p.rating)
    .slice(0, 4)
    .map((x) => x.p);

  if (related.length) {
    $("#related").innerHTML = related.map(UI.renderCard).join("");
    $("#related-section").hidden = false;
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
