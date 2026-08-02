/* ==========================================================================
   Catalog — instant, client-side filtering.

   Every filter change re-renders from memory and rewrites the URL, so results
   appear with no network round-trip while the page stays linkable and
   back-button friendly.
   ========================================================================== */
(function () {
  "use strict";

  const { AL, UI, Cart } = window;
  const { $, $$, esc, norm, money } = UI;

  const PRICE_BANDS = [
    { id: "0-25", label: "Sub 25 lei", min: 0, max: 25 },
    { id: "25-50", label: "25 – 50 lei", min: 25, max: 50 },
    { id: "50-100", label: "50 – 100 lei", min: 50, max: 100 },
    { id: "100-200", label: "100 – 200 lei", min: 100, max: 200 },
    { id: "200+", label: "Peste 200 lei", min: 200, max: Infinity },
  ];

  const state = { cat: null, tag: null, q: "", price: null, stock: false, sort: "popular" };

  /* ---- URL <-> state -------------------------------------------------- */

  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.cat = p.get("cat");
    state.tag = p.get("tag");
    state.q = p.get("q") || "";
    state.price = p.get("price");
    state.stock = p.get("stock") === "1";
    state.sort = p.get("sort") || "popular";
    if (state.cat && !AL.categories.some((c) => c.slug === state.cat)) state.cat = null;
    if (state.price && !PRICE_BANDS.some((b) => b.id === state.price)) state.price = null;
  }

  function writeUrl() {
    const p = new URLSearchParams();
    if (state.cat) p.set("cat", state.cat);
    if (state.tag) p.set("tag", state.tag);
    if (state.q) p.set("q", state.q);
    if (state.price) p.set("price", state.price);
    if (state.stock) p.set("stock", "1");
    if (state.sort !== "popular") p.set("sort", state.sort);
    const qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  /* ---- filtering ------------------------------------------------------ */

  /** Apply every filter except one — used to count what each option would yield. */
  function filtered(except) {
    const q = norm(state.q);
    return AL.products.filter((p) => {
      if (except !== "cat" && state.cat && p.cat !== state.cat) return false;
      if (except !== "tag" && state.tag && !(p.tags || []).some((t) => norm(t) === norm(state.tag)))
        return false;
      if (except !== "stock" && state.stock && p.stock === 0) return false;
      if (except !== "price" && state.price) {
        const band = PRICE_BANDS.find((b) => b.id === state.price);
        if (band && (p.price < band.min || p.price >= band.max)) return false;
      }
      if (q) {
        const hay = norm(
          p.name + " " + AL.categoryOf(p).name + " " + (p.tags || []).join(" ") + " " + (p.desc || "")
        );
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function sorted(list) {
    const out = list.slice();
    switch (state.sort) {
      case "price-asc":
        return out.sort((a, b) => a.price - b.price);
      case "price-desc":
        return out.sort((a, b) => b.price - a.price);
      case "rating":
        return out.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      case "discount":
        return out.sort(
          (a, b) => (b.old ? b.old - b.price : 0) - (a.old ? a.old - a.price : 0)
        );
      default:
        // "Recomandate": in stock first, then bestsellers, then rating
        return out.sort(
          (a, b) =>
            (b.stock > 0) - (a.stock > 0) ||
            (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) ||
            b.rating - a.rating
        );
    }
  }

  /* ---- rendering ------------------------------------------------------ */

  function renderFilters() {
    // Category — counts reflect every other active filter
    const catBase = filtered("cat");
    $("#f-cat").innerHTML = [
      `<button data-cat="" aria-pressed="${!state.cat}">
         <span>Toate categoriile</span><span class="fl-count">${catBase.length}</span></button>`,
    ]
      .concat(
        AL.categories.map((c) => {
          const n = catBase.filter((p) => p.cat === c.slug).length;
          return `<button data-cat="${c.slug}" aria-pressed="${state.cat === c.slug}" ${
            n === 0 ? "disabled style=opacity:.4" : ""
          }>
            <span>${esc(c.name)}</span><span class="fl-count">${n}</span></button>`;
        })
      )
      .join("");

    const priceBase = filtered("price");
    $("#f-price").innerHTML = PRICE_BANDS.map((b) => {
      const n = priceBase.filter((p) => p.price >= b.min && p.price < b.max).length;
      return `<button data-price="${b.id}" aria-pressed="${state.price === b.id}" ${
        n === 0 ? "disabled style=opacity:.4" : ""
      }>
        <span>${b.label}</span><span class="fl-count">${n}</span></button>`;
    }).join("");

    const stockBase = filtered("stock");
    $("#f-stock").innerHTML = `<button data-stock="1" aria-pressed="${state.stock}">
      <span>Doar produse în stoc</span>
      <span class="fl-count">${stockBase.filter((p) => p.stock > 0).length}</span></button>`;
  }

  function renderActive() {
    const chips = [];
    if (state.cat) {
      const c = AL.categories.find((x) => x.slug === state.cat);
      if (c) chips.push({ label: c.name, key: "cat" });
    }
    if (state.tag) chips.push({ label: state.tag, key: "tag" });
    if (state.q) chips.push({ label: `„${state.q}”`, key: "q" });
    if (state.price) {
      const b = PRICE_BANDS.find((x) => x.id === state.price);
      if (b) chips.push({ label: b.label, key: "price" });
    }
    if (state.stock) chips.push({ label: "În stoc", key: "stock" });

    $("#active-filters").innerHTML = chips
      .map(
        (c) => `<span class="tag">${esc(c.label)}
      <button data-clear="${c.key}" aria-label="Elimină filtrul ${esc(c.label)}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button></span>`
      )
      .join("");
  }

  function renderHeading() {
    const cat = state.cat && AL.categories.find((c) => c.slug === state.cat);
    let title = "Toate produsele";
    let blurb = "Filtrează, sortează și adaugă în coș fără să părăsești pagina.";
    if (cat) {
      title = cat.name;
      blurb = cat.blurb;
    } else if (state.tag) {
      title = "Produse pentru: " + state.tag;
      blurb = "Selecție potrivită pentru ce ai nevoie.";
    } else if (state.q) {
      title = "Rezultate pentru „" + state.q + "”";
      blurb = "";
    }
    $("#cat-title").textContent = title;
    $("#crumb").textContent = title;
    $("#cat-blurb").textContent = blurb;
    $("#cat-blurb").hidden = !blurb;
    document.title = title + " — Aroma Land Shop";
  }

  function render() {
    const list = sorted(filtered());
    const results = $("#results");
    const empty = $("#no-results");

    results.innerHTML = list.map(UI.renderCard).join("");
    results.hidden = list.length === 0;
    empty.hidden = list.length > 0;

    $("#result-count").textContent =
      list.length === 1 ? "1 produs" : list.length + " produse";
    $("#apply-count").textContent = list.length;

    renderHeading();
    renderFilters();
    renderActive();
    writeUrl();
  }

  /* ---- mobile filter sheet -------------------------------------------- */

  const filtersEl = $("#filters");
  let filterScrim;

  function openFilters() {
    if (!filterScrim) {
      filterScrim = document.createElement("div");
      filterScrim.className = "scrim";
      document.body.appendChild(filterScrim);
      filterScrim.addEventListener("click", closeFilters);
    }
    filtersEl.classList.add("is-open");
    filterScrim.classList.add("is-open");
    document.body.classList.add("is-locked");
    $("#open-filters").setAttribute("aria-expanded", "true");
  }

  function closeFilters() {
    filtersEl.classList.remove("is-open");
    if (filterScrim) filterScrim.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    $("#open-filters").setAttribute("aria-expanded", "false");
  }

  /* ---- events ---------------------------------------------------------- */

  filtersEl.addEventListener("click", (e) => {
    const cat = e.target.closest("[data-cat]");
    if (cat) {
      state.cat = cat.dataset.cat || null;
      return render();
    }
    const price = e.target.closest("[data-price]");
    if (price) {
      state.price = state.price === price.dataset.price ? null : price.dataset.price;
      return render();
    }
    const stock = e.target.closest("[data-stock]");
    if (stock) {
      state.stock = !state.stock;
      return render();
    }
    if (e.target.closest("[data-filters-close]")) closeFilters();
  });

  $("#active-filters").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-clear]");
    if (!btn) return;
    const key = btn.dataset.clear;
    if (key === "stock") state.stock = false;
    else if (key === "q") state.q = "";
    else state[key] = null;
    render();
  });

  $("#sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
    $("#results").scrollIntoView({ block: "nearest" });
  });

  function clearAll() {
    state.cat = state.tag = state.price = null;
    state.q = "";
    state.stock = false;
    render();
  }
  $("#clear-all").addEventListener("click", clearAll);
  $("#reset-from-empty").addEventListener("click", clearAll);
  $("#open-filters").addEventListener("click", openFilters);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && filtersEl.classList.contains("is-open")) closeFilters();
  });

  /* ---- boot ------------------------------------------------------------ */

  readUrl();
  $("#sort").value = state.sort;
  render();

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
