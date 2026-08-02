/* ==========================================================================
   Product artwork — generated inline SVG.

   The redesign ships with zero image requests: every product, category and
   editorial visual is a small vector drawn from the product's own hue. That
   keeps LCP fast and the page weight flat regardless of catalog size.

   Swap `productArt()` for real photography when the photo pipeline is ready —
   the call sites only need `{ src | svg }`, nothing else changes.
   ========================================================================== */
(function (global) {
  "use strict";

  let uid = 0;

  function frame(hue, sat, body, label) {
    const id = "g" + ++uid;
    const id2 = "s" + uid;
    return `<svg viewBox="0 0 400 400" role="img" aria-label="${esc(label || "")}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="hsl(${hue} ${sat}% 93%)"/>
      <stop offset="1" stop-color="hsl(${(hue + 18) % 360} ${Math.round(sat * 0.85)}% 82%)"/>
    </linearGradient>
    <linearGradient id="${id2}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 32% 34%)"/>
      <stop offset="1" stop-color="hsl(${(hue + 12) % 360} 34% 22%)"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#${id})"/>
  <circle cx="200" cy="212" r="128" fill="#fff" opacity=".28"/>
  <g fill="url(#${id2})">${body.replace(/%S%/g, id2)}</g>
</svg>`;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  }

  /* ---- silhouettes -------------------------------------------------- */

  const shapes = {
    // Dropper bottle — scented & essential oils
    oil: `
      <rect x="176" y="96" width="48" height="26" rx="7"/>
      <rect x="186" y="118" width="28" height="20"/>
      <path d="M152 156a26 26 0 0 1 26-26h44a26 26 0 0 1 26 26v122a26 26 0 0 1-26 26h-44a26 26 0 0 1-26-26z"/>
      <rect x="170" y="188" width="60" height="72" rx="9" fill="#fff" opacity=".82"/>
      <rect x="182" y="208" width="36" height="5" rx="2.5" opacity=".28"/>
      <rect x="182" y="222" width="24" height="5" rx="2.5" opacity=".28"/>`,

    // Ultrasonic diffuser — dome body with mist
    diffuser: `
      <path d="M200 268c-46 0-80-26-80-62 0-34 30-58 80-58s80 24 80 58c0 36-34 62-80 62z" opacity=".16"/>
      <path d="M120 232c0-42 36-72 80-72s80 30 80 72c0 34-36 56-80 56s-80-22-80-56z"/>
      <ellipse cx="200" cy="234" rx="46" ry="15" fill="#fff" opacity=".75"/>
      <rect x="140" y="286" width="120" height="16" rx="8"/>
      <path d="M186 132c0-14 22-14 22-28s-16-14-16-24" fill="none" stroke="url(#%S%)" stroke-width="9" stroke-linecap="round" opacity=".55"/>
      <path d="M216 142c0-11 17-11 17-22" fill="none" stroke="url(#%S%)" stroke-width="8" stroke-linecap="round" opacity=".38"/>`,

    // Ceramic burner / aroma lamp
    burner: `
      <path d="M132 210h136c0 46-30 74-68 74s-68-28-68-74z"/>
      <ellipse cx="200" cy="210" rx="68" ry="18" fill="#fff" opacity=".7"/>
      <rect x="176" y="278" width="48" height="14"/>
      <path d="M138 292h124a10 10 0 0 1 10 10v6H128v-6a10 10 0 0 1 10-10z"/>
      <path d="M200 108c22 22 30 36 30 50a30 30 0 1 1-60 0c0-14 8-28 30-50z" opacity=".5"/>
      <path d="M200 134c12 13 17 21 17 29a17 17 0 1 1-34 0c0-8 5-16 17-29" fill="#fff" opacity=".55"/>`,

    // Reed diffuser — bottle with rattan sticks
    reed: `
      <g stroke="url(#%S%)" stroke-width="8" stroke-linecap="round" fill="none">
        <path d="M200 220V92"/><path d="M182 220 150 104"/><path d="M218 220l32-116"/>
        <path d="M166 220 118 132"/><path d="M234 220l48-88"/>
      </g>
      <path d="M158 214h84a30 30 0 0 1 30 30v42a30 30 0 0 1-30 30h-84a30 30 0 0 1-30-30v-42a30 30 0 0 1 30-30z"/>
      <rect x="176" y="196" width="48" height="24" rx="6"/>
      <rect x="150" y="252" width="100" height="34" rx="8" fill="#fff" opacity=".8"/>`,

    // Candle in a jar
    candle: `
      <path d="M200 108c16 20 23 30 23 42a23 23 0 1 1-46 0c0-12 7-22 23-42z" opacity=".55"/>
      <path d="M200 132c8 11 12 17 12 24a12 12 0 1 1-24 0c0-7 4-13 12-24" fill="#fff" opacity=".6"/>
      <rect x="197" y="176" width="6" height="26" rx="3"/>
      <path d="M136 198h128v82a34 34 0 0 1-34 34h-60a34 34 0 0 1-34-34z"/>
      <ellipse cx="200" cy="198" rx="64" ry="17" fill="#fff" opacity=".72"/>
      <rect x="156" y="240" width="88" height="46" rx="8" fill="#fff" opacity=".78"/>
      <rect x="176" y="258" width="48" height="6" rx="3" opacity=".3"/>`,

    // Room spray
    spray: `
      <rect x="178" y="82" width="44" height="30" rx="8"/>
      <path d="M222 92h26a8 8 0 0 1 0 16h-26z"/>
      <rect x="188" y="110" width="24" height="26"/>
      <path d="M148 164a30 30 0 0 1 30-30h44a30 30 0 0 1 30 30v112a30 30 0 0 1-30 30h-44a30 30 0 0 1-30-30z"/>
      <rect x="166" y="196" width="68" height="84" rx="10" fill="#fff" opacity=".82"/>
      <rect x="182" y="220" width="36" height="6" rx="3" opacity=".28"/>
      <rect x="182" y="236" width="26" height="6" rx="3" opacity=".28"/>
      <g fill="url(#%S%)" opacity=".42">
        <circle cx="272" cy="86" r="6"/><circle cx="296" cy="104" r="4.5"/><circle cx="284" cy="128" r="5.5"/><circle cx="308" cy="72" r="4"/>
      </g>`,

    // Potpourri bowl / scented sachet
    potpourri: `
      <path d="M118 208h164c0 52-36 84-82 84s-82-32-82-84z"/>
      <ellipse cx="200" cy="208" rx="82" ry="22" fill="#fff" opacity=".72"/>
      <g opacity=".85">
        <circle cx="168" cy="196" r="19"/><circle cx="208" cy="188" r="23"/><circle cx="242" cy="200" r="17"/>
        <circle cx="188" cy="206" r="14"/><circle cx="226" cy="208" r="13"/>
      </g>
      <path d="M150 292h100a12 12 0 0 1 12 12v4H138v-4a12 12 0 0 1 12-12z"/>`,

    // Gift set — box with ribbon
    giftset: `
      <path d="M116 168h168v128a20 20 0 0 1-20 20H136a20 20 0 0 1-20-20z"/>
      <rect x="104" y="140" width="192" height="40" rx="10"/>
      <rect x="184" y="140" width="32" height="176" fill="#fff" opacity=".78"/>
      <path d="M200 140c-14-30-46-38-56-22-8 13 10 24 56 22z" opacity=".7"/>
      <path d="M200 140c14-30 46-38 56-22 8 13-10 24-56 22z" opacity=".7"/>`,

    // Humidifier / device accessory
    device: `
      <rect x="132" y="150" width="136" height="150" rx="34"/>
      <rect x="152" y="176" width="96" height="62" rx="14" fill="#fff" opacity=".8"/>
      <circle cx="200" cy="268" r="15" fill="#fff" opacity=".7"/>
      <path d="M176 128c0-12 20-12 20-24" fill="none" stroke="url(#%S%)" stroke-width="8" stroke-linecap="round" opacity=".45"/>
      <path d="M212 134c0-10 15-10 15-20" fill="none" stroke="url(#%S%)" stroke-width="7" stroke-linecap="round" opacity=".33"/>`,
  };

  /* ---- public API ---------------------------------------------------- */

  function productArt(product) {
    const shape = shapes[product.art] || shapes.oil;
    return frame(product.hue, product.sat || 42, shape, product.name);
  }

  function sceneArt(hue, kind, label) {
    return frame(hue, 44, shapes[kind] || shapes.diffuser, label);
  }

  global.ALArt = { productArt, sceneArt, shapes };
})(window);
