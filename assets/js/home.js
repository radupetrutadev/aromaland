/* Home page rendering. */
(function () {
  "use strict";

  const { AL, UI, ALArt } = window;
  const { $, esc } = UI;

  /* Categories */
  const catGrid = $("#cat-grid");
  if (catGrid) {
    catGrid.innerHTML = AL.categories
      .map(
        (c) => `<a class="cat-tile" href="catalog.html?cat=${c.slug}">
  <div class="ct-art">${ALArt.sceneArt(c.hue, c.art, c.name)}</div>
  <div class="ct-body">
    <div class="ct-name">${esc(c.name)}</div>
    <div class="ct-count">${c.count} produse</div>
  </div>
</a>`
      )
      .join("");
  }

  /* Bestsellers — highest rated of the flagged products, capped at 8 */
  const best = $("#bestsellers");
  if (best) {
    const picks = AL.products
      .filter((p) => p.bestseller && p.stock > 0)
      .concat(
        AL.products.filter((p) => !p.bestseller && p.stock > 0).sort((a, b) => b.rating - a.rating)
      )
      .slice(0, 8);
    best.innerHTML = picks.map(UI.renderCard).join("");
  }

  /* Shop by intent — for shoppers who know the feeling, not the SKU */
  const moments = $("#moments");
  if (moments) {
    const list = [
      { label: "Vreau să dorm mai bine", q: "tag=somn" },
      { label: "Vreau să mă relaxez", q: "tag=relaxare" },
      { label: "Am nevoie de energie", q: "tag=energie" },
      { label: "Caut un cadou", q: "cat=seturi-cadou" },
      { label: "Miros de curat", q: "tag=proaspăt" },
      { label: "Ceva cald, de iarnă", q: "tag=cald" },
    ];
    moments.innerHTML = list
      .map((m) => `<a class="chip" href="catalog.html?${m.q}">${esc(m.label)}</a>`)
      .join("");
  }

  /* Editorial visual */
  const story = $("#story-art");
  if (story) story.innerHTML = ALArt.sceneArt(38, "burner", "Arzător ceramic Aroma Land");

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
