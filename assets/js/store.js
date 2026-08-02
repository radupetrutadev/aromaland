/* ==========================================================================
   Cart store — localStorage backed, synchronous, framework-free.

   The cart is the one piece of state shared by every page, so it lives here
   and everything else subscribes. Writes are persisted immediately and
   broadcast to other open tabs via the `storage` event.
   ========================================================================== */
(function (global) {
  "use strict";

  const KEY = "al.cart.v1";
  const THEME_KEY = "al.theme";
  const MAX_QTY = 99;

  let entries = load();
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Drop anything that no longer exists in the catalog.
      return parsed
        .filter((e) => e && typeof e.id === "string" && global.AL.get(e.id))
        .map((e) => ({
          id: e.id,
          size: typeof e.size === "string" ? e.size : null,
          qty: clampQty(e.qty),
        }));
    } catch (err) {
      return [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
    } catch (err) {
      /* private mode or quota exceeded — the cart still works in-memory */
    }
  }

  function clampQty(n) {
    const q = Math.floor(Number(n) || 0);
    return Math.min(Math.max(q, 1), MAX_QTY);
  }

  function keyOf(id, size) {
    return id + "::" + (size || "");
  }

  function emit() {
    listeners.forEach((fn) => {
      try {
        fn(api);
      } catch (err) {
        console.error(err);
      }
    });
  }

  function commit() {
    persist();
    emit();
  }

  /* ---- reads ---------------------------------------------------------- */

  /** Cart lines joined with their catalog product, ready to render. */
  function lines() {
    return entries.reduce((out, e) => {
      const product = global.AL.get(e.id);
      if (!product) return out;
      const unit = global.AL.priceOf(product, e.size);
      out.push({
        key: keyOf(e.id, e.size),
        id: e.id,
        size: e.size,
        qty: e.qty,
        product,
        unit,
        total: unit * e.qty,
      });
      return out;
    }, []);
  }

  function count() {
    return entries.reduce((n, e) => n + e.qty, 0);
  }

  function subtotal() {
    return lines().reduce((sum, l) => sum + l.total, 0);
  }

  /** Courier is free once the order clears the free-shipping threshold. */
  function shipping(method) {
    if (method === "pickup") return 0;
    return subtotal() >= global.AL.FREE_SHIPPING_THRESHOLD
      ? 0
      : global.AL.COURIER_FEE;
  }

  function total(method) {
    return subtotal() + shipping(method);
  }

  function remainingForFreeShipping() {
    return Math.max(0, global.AL.FREE_SHIPPING_THRESHOLD - subtotal());
  }

  function isEmpty() {
    return entries.length === 0;
  }

  /* ---- writes --------------------------------------------------------- */

  function add(id, size, qty) {
    const product = global.AL.get(id);
    if (!product) return null;
    // Default to the first size so a one-tap add from a grid card still works.
    const chosen = size || (product.sizes ? product.sizes[0].label : null);
    const k = keyOf(id, chosen);
    const existing = entries.find((e) => keyOf(e.id, e.size) === k);
    if (existing) {
      existing.qty = clampQty(existing.qty + (qty || 1));
    } else {
      entries.push({ id, size: chosen, qty: clampQty(qty || 1) });
    }
    commit();
    return k;
  }

  function setQty(key, qty) {
    const entry = entries.find((e) => keyOf(e.id, e.size) === key);
    if (!entry) return;
    if (qty <= 0) return remove(key);
    entry.qty = clampQty(qty);
    commit();
  }

  function remove(key) {
    const next = entries.filter((e) => keyOf(e.id, e.size) !== key);
    if (next.length === entries.length) return;
    entries = next;
    commit();
  }

  function clear() {
    entries = [];
    commit();
  }

  function subscribe(fn) {
    listeners.add(fn);
    fn(api);
    return () => listeners.delete(fn);
  }

  // Keep multiple tabs in sync.
  global.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    entries = load();
    emit();
  });

  /* ---- theme ---------------------------------------------------------- */

  const Theme = {
    get() {
      try {
        return localStorage.getItem(THEME_KEY) || "auto";
      } catch (err) {
        return "auto";
      }
    },
    apply(mode) {
      const resolved =
        mode === "auto"
          ? global.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : mode;
      document.documentElement.setAttribute("data-theme", resolved);
      return resolved;
    },
    set(mode) {
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch (err) {
        /* ignore */
      }
      return Theme.apply(mode);
    },
    toggle() {
      const current = document.documentElement.getAttribute("data-theme");
      return Theme.set(current === "dark" ? "light" : "dark");
    },
  };

  const api = {
    lines,
    count,
    subtotal,
    shipping,
    total,
    remainingForFreeShipping,
    isEmpty,
    add,
    setQty,
    remove,
    clear,
    subscribe,
    keyOf,
    MAX_QTY,
  };

  global.Cart = api;
  global.Theme = Theme;
})(window);
