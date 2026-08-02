/* Cart page — mirrors the drawer, with room to review a larger order. */
(function () {
  "use strict";

  const { AL, UI, Cart, ALArt } = window;
  const { $, esc, money } = UI;

  function lineHtml(l) {
    return `<div class="line">
  <div class="line-art">${ALArt.productArt(l.product)}</div>
  <div>
    <a class="line-name" href="product.html?id=${encodeURIComponent(l.id)}">${esc(
      l.product.name
    )}</a>
    ${l.size ? `<div class="line-variant">${esc(l.size)}</div>` : ""}
    <div class="line-variant">${money(l.unit)} / buc</div>
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

  function totalsHtml() {
    const sub = Cart.subtotal();
    const ship = Cart.shipping("courier");
    const remaining = Cart.remainingForFreeShipping();
    return `
  <div class="t-row"><span>Subtotal</span><span>${money(sub)}</span></div>
  <div class="t-row ${ship === 0 ? "is-free" : ""}">
    <span>Transport (curier)</span><span>${ship === 0 ? "Gratuit" : money(ship)}</span>
  </div>
  ${
    remaining > 0
      ? `<p class="tiny muted" style="margin:0">Mai adaugă <strong>${money(
          remaining
        )}</strong> și transportul e gratuit.</p>`
      : ""
  }
  <div class="t-grand"><span class="g-label">Total</span><span class="g-value">${money(
    sub + ship
  )}</span></div>`;
  }

  function render() {
    // Keep keyboard focus on the stepper the shopper is using.
    UI.withFocusRestore($("#cart-full"), () => {
      const lines = Cart.lines();
      const empty = lines.length === 0;
      $("#cart-empty").hidden = !empty;
      $("#cart-full").hidden = empty;
      if (empty) return;
      $("#cart-lines").innerHTML = lines.map(lineHtml).join("");
      $("#cart-totals").innerHTML = totalsHtml();
    });
  }

  Cart.subscribe(render);

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
