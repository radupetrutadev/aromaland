/* ==========================================================================
   Single-screen guest checkout.

   Design rules applied here:
   - no account, no login wall, no multi-step wizard;
   - only fields that are needed to ship the order;
   - the address block disappears entirely for in-store pickup;
   - errors are inline and appear on blur, never as an alert;
   - the total is repeated on the submit button so nothing is a surprise.

   `submitOrder()` is the only integration point — swap the simulated delay
   for the real order API (and redirect to the payment processor when the
   chosen method is "card").
   ========================================================================== */
(function () {
  "use strict";

  const { AL, UI, Cart, ALArt } = window;
  const { $, $$, esc, money } = UI;

  const COUNTIES = [
    "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
    "Brăila", "Brașov", "București", "Buzău", "Călărași", "Caraș-Severin",
    "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
    "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
    "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare",
    "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vâlcea", "Vaslui",
    "Vrancea",
  ];

  const form = $("#co-form");
  const countySelect = $("#county");
  countySelect.insertAdjacentHTML(
    "beforeend",
    COUNTIES.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("")
  );

  /* ---- summary --------------------------------------------------------- */

  function deliveryMethod() {
    const checked = form.querySelector('input[name="delivery"]:checked');
    return checked ? checked.value : "courier";
  }

  function renderSummary() {
    const lines = Cart.lines();

    $("#co-lines").innerHTML = lines
      .map(
        (l) => `<div class="line">
  <div class="line-art">${ALArt.productArt(l.product)}</div>
  <div>
    <span class="line-name">${esc(l.product.name)}</span>
    ${l.size ? `<div class="line-variant">${esc(l.size)}</div>` : ""}
    <div class="line-bottom">
      <span class="tiny muted">Cantitate: ${l.qty}</span>
      <span class="line-price">${money(l.total)}</span>
    </div>
  </div>
</div>`
      )
      .join("");

    const method = deliveryMethod();
    const sub = Cart.subtotal();
    const ship = Cart.shipping(method);
    const total = sub + ship;

    $("#co-totals").innerHTML = `
  <div class="t-row"><span>Subtotal (${Cart.count()} produse)</span><span>${money(sub)}</span></div>
  <div class="t-row ${ship === 0 ? "is-free" : ""}">
    <span>${method === "pickup" ? "Ridicare personală" : "Transport"}</span>
    <span>${ship === 0 ? "Gratuit" : money(ship)}</span>
  </div>
  <div class="t-grand"><span class="g-label">Total</span><span class="g-value">${money(total)}</span></div>`;

    $("#btn-total").textContent = money(total);
    $("#courier-price").textContent =
      Cart.subtotal() >= AL.FREE_SHIPPING_THRESHOLD ? "Gratuit" : money(AL.COURIER_FEE);
  }

  /* ---- validation ------------------------------------------------------ */

  const RULES = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    phone: (v) => /^(\+4)?0\d{9}$/.test(v.replace(/[\s.-]/g, "")),
    name: (v) => v.trim().length >= 3,
    county: (v) => v !== "",
    city: (v) => v.trim().length >= 2,
    street: (v) => v.trim().length >= 5,
    "pickup-name": (v) => v.trim().length >= 3,
  };

  /** Which fields matter right now depends on the delivery method. */
  function activeFields() {
    const base = ["email", "phone"];
    return deliveryMethod() === "pickup"
      ? base.concat("pickup-name")
      : base.concat(["name", "county", "city", "street"]);
  }

  function setError(id, on) {
    const input = document.getElementById(id);
    if (!input) return;
    const field = input.closest(".field");
    if (field) field.classList.toggle("has-error", on);
    input.setAttribute("aria-invalid", String(on));
  }

  function validateField(id) {
    const input = document.getElementById(id);
    if (!input) return true;
    const ok = RULES[id] ? RULES[id](input.value) : true;
    setError(id, !ok);
    return ok;
  }

  function validateAll() {
    let firstBad = null;
    activeFields().forEach((id) => {
      if (!validateField(id) && !firstBad) firstBad = document.getElementById(id);
    });

    const terms = $("#terms");
    const termsOk = terms.checked;
    $('[data-error-for="terms"]').style.display = termsOk ? "none" : "block";
    if (!termsOk && !firstBad) firstBad = terms;

    return { ok: !firstBad, firstBad };
  }

  // Validate on blur, then live-correct once a field has been marked bad.
  Object.keys(RULES).forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("blur", () => {
      if (input.value.trim()) validateField(id);
    });
    input.addEventListener("input", () => {
      const field = input.closest(".field");
      if (field && field.classList.contains("has-error")) validateField(id);
    });
  });

  $("#terms").addEventListener("change", () => {
    if ($("#terms").checked) $('[data-error-for="terms"]').style.display = "none";
  });

  /* ---- conditional blocks ---------------------------------------------- */

  form.addEventListener("change", (e) => {
    if (e.target.name === "delivery") {
      const pickup = deliveryMethod() === "pickup";
      $("#addr-fields").hidden = pickup;
      $("#pickup-info").hidden = !pickup;
      // Clear stale errors from the block that is now hidden.
      ["name", "county", "city", "street", "pickup-name"].forEach((id) =>
        setError(id, false)
      );
      renderSummary();
    }
    if (e.target.id === "company") {
      $("#company-fields").hidden = !e.target.checked;
    }
  });

  /* ---- submit ----------------------------------------------------------- */

  function orderNumber() {
    const n = Math.floor(100000 + Math.random() * 900000);
    return "AL-" + new Date().getFullYear() + "-" + n;
  }

  /** INTEGRATION POINT — replace with the real order API. */
  function submitOrder(payload) {
    return new Promise((resolve) => setTimeout(() => resolve(payload), 700));
  }

  /* Once the order is placed the cart is emptied on purpose — the empty-cart
     state must not reappear behind the confirmation. */
  let orderPlaced = false;

  function showConfirmation(order) {
    $("#co-main").hidden = true;
    $("#co-empty").hidden = true;
    const done = $("#co-done");
    done.hidden = false;
    done.innerHTML = `<div class="confirm">
  <div class="tick">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>
  </div>
  <h1>Mulțumim, ${esc(order.firstName)}!</h1>
  <p class="muted" style="margin-top:12px">
    Comanda ta a fost înregistrată. Ți-am trimis confirmarea pe
    <strong>${esc(order.email)}</strong>.
  </p>
  <p class="order-no">${esc(order.number)}</p>
  <div class="pdp-facts" style="margin-top:28px;text-align:left">
    <ul class="reset" style="display:contents">
      <li>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>
        <span><span class="f-title">${
          order.delivery === "pickup" ? "Ridicare personală" : "Livrare 24–48h"
        }</span>
        <span class="f-sub">${
          order.delivery === "pickup"
            ? "Te anunțăm prin SMS când comanda e gata."
            : "Primești codul AWB imediat ce coletul pleacă."
        }</span></span>
      </li>
      <li>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
        <span><span class="f-title">${
          order.payment === "card" ? "Plată cu cardul" : "Plată ramburs"
        }</span>
        <span class="f-sub">Total: ${money(order.total)}</span></span>
      </li>
    </ul>
  </div>
  <div class="row" style="justify-content:center;margin-top:28px">
    <a class="btn btn-primary" href="catalog.html">Continuă cumpărăturile</a>
    <a class="btn btn-ghost" href="index.html">Înapoi acasă</a>
  </div>
</div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Comandă confirmată — Aroma Land Shop";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { ok, firstBad } = validateAll();
    if (!ok) {
      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      return;
    }

    const btn = $("#place-order");
    btn.disabled = true;
    btn.textContent = "Se trimite…";

    const method = deliveryMethod();
    const fullName =
      method === "pickup" ? $("#pickup-name").value.trim() : $("#name").value.trim();

    const payload = {
      number: orderNumber(),
      email: $("#email").value.trim(),
      phone: $("#phone").value.trim(),
      firstName: fullName.split(/\s+/)[0] || fullName,
      delivery: method,
      payment: form.querySelector('input[name="payment"]:checked').value,
      total: Cart.subtotal() + Cart.shipping(method),
      items: Cart.lines().map((l) => ({
        id: l.id, size: l.size, qty: l.qty, unit: l.unit,
      })),
    };

    try {
      const order = await submitOrder(payload);
      orderPlaced = true;
      Cart.clear();
      showConfirmation(order);
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = 'Trimite comanda · <span id="btn-total"></span>';
      renderSummary();
      UI.toast("Nu am putut trimite comanda. Încearcă din nou.");
    }
  });

  /* ---- boot -------------------------------------------------------------- */

  function boot() {
    // Never render checkout over an empty cart — but don't let the emptying
    // that follows a successful order flash the empty state.
    if (orderPlaced) return;
    const empty = Cart.isEmpty();
    $("#co-empty").hidden = !empty;
    $("#co-main").hidden = empty;
    if (!empty) renderSummary();
  }

  Cart.subscribe(boot);

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
