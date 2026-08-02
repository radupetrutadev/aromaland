/* ==========================================================================
   Catalog

   NOTE FOR INTEGRATION: this file is the single seam between the storefront
   and a real backend. Every page reads the catalog only through `AL.products`
   / `AL.categories`, so replacing this file with a fetch from the live product
   feed (or rendering it server-side) requires no changes anywhere else.

   Product names, prices, stock and copy below are representative placeholders
   modelled on the real Aroma Land range — replace with the live feed.
   ========================================================================== */
(function (global) {
  "use strict";

  const FREE_SHIPPING_THRESHOLD = 250; // lei — matches the current shop policy
  const COURIER_FEE = 19.9;

  const categories = [
    {
      slug: "uleiuri-parfumate",
      name: "Uleiuri parfumate",
      hue: 32,
      art: "oil",
      blurb: "Pentru difuzoare ceramice și cu ultrasunete. Peste 40 de arome.",
    },
    {
      slug: "uleiuri-esentiale",
      name: "Uleiuri esențiale",
      hue: 96,
      art: "oil",
      blurb: "100% pure, extrase prin distilare. Pentru aromaterapie și masaj.",
    },
    {
      slug: "difuzoare",
      name: "Difuzoare",
      hue: 200,
      art: "diffuser",
      blurb: "Cu ultrasunete, ceramice sau electrice. Difuzie fină și uniformă.",
    },
    {
      slug: "betisoare-reed",
      name: "Bețișoare & Reed",
      hue: 24,
      art: "reed",
      blurb: "Parfumare continuă, fără electricitate și fără flacără.",
    },
    {
      slug: "lumanari",
      name: "Lumânări parfumate",
      hue: 14,
      art: "candle",
      blurb: "Ceară vegetală, ardere curată, până la 45 de ore.",
    },
    {
      slug: "parfumuri-camera",
      name: "Parfumuri de cameră",
      hue: 268,
      art: "spray",
      blurb: "Spray-uri instant pentru cameră, textile și mașină.",
    },
    {
      slug: "seturi-cadou",
      name: "Seturi cadou",
      hue: 340,
      art: "giftset",
      blurb: "Gata ambalate. Alegerea sigură când nu ai timp de ales.",
    },
    {
      slug: "decoratiuni",
      name: "Potpourri & decor",
      hue: 300,
      art: "potpourri",
      blurb: "Săculeți, potpourri și figurine parfumate pentru orice colț.",
    },
  ];

  const ML = [
    { label: "10 ml", delta: 0 },
    { label: "25 ml", delta: 12 },
    { label: "50 ml", delta: 26 },
  ];

  const products = [
    /* ---- Uleiuri parfumate ---- */
    {
      id: "up-lavanda",
      name: "Ulei parfumat Lavandă",
      cat: "uleiuri-parfumate",
      price: 14.9,
      art: "oil", hue: 265,
      rating: 4.8, reviews: 214, stock: 62,
      tags: ["relaxare", "somn", "floral"],
      sizes: ML,
      desc: "Lavandă franceză, calmă și curată — aroma clasică pentru serile în care vrei să te oprești din alergat.",
      notes: ["Lavandă", "Bergamotă", "Mosc alb"],
      usage: "3–5 picături în apa difuzorului cu ultrasunete sau în cupa arzătorului ceramic.",
      bestseller: true,
    },
    {
      id: "up-vanilie",
      name: "Ulei parfumat Vanilie",
      cat: "uleiuri-parfumate",
      price: 14.9,
      art: "oil", hue: 38,
      rating: 4.7, reviews: 186, stock: 48,
      tags: ["dulce", "cald", "gourmand"],
      sizes: ML,
      desc: "Vanilie caldă de Madagascar, cu un fundal ușor lemnos. Aroma care face casa să pară primitoare.",
      notes: ["Vanilie", "Tonka", "Lemn de santal"],
      usage: "3–5 picături în apa difuzorului. Pentru camere peste 25 m², crește la 7 picături.",
      bestseller: true,
    },
    {
      id: "up-scortisoara",
      name: "Ulei parfumat Scorțișoară & Portocale",
      cat: "uleiuri-parfumate",
      price: 15.9,
      art: "oil", hue: 20,
      rating: 4.6, reviews: 132, stock: 40,
      tags: ["condimentat", "iarnă", "citric"],
      sizes: ML,
      desc: "Scorțișoară și coajă de portocală — aroma de sezon rece, fără să fie dulceagă.",
      notes: ["Scorțișoară", "Portocală", "Cuișoare"],
      usage: "3–5 picături în apa difuzorului sau pe un săculeț de potpourri.",
    },
    {
      id: "up-iasomie",
      name: "Ulei parfumat Iasomie",
      cat: "uleiuri-parfumate",
      price: 14.9,
      art: "oil", hue: 315,
      rating: 4.5, reviews: 98, stock: 35,
      tags: ["floral", "intens"],
      sizes: ML,
      desc: "Iasomie bogată, ușor mieroasă. Un floral care se simte imediat, în doze mici.",
      notes: ["Iasomie", "Ylang-ylang", "Mosc"],
      usage: "2–4 picături — este un parfum intens, mai puțin înseamnă mai bine.",
    },
    {
      id: "up-santal",
      name: "Ulei parfumat Lemn de santal",
      cat: "uleiuri-parfumate",
      price: 16.9,
      art: "oil", hue: 28,
      rating: 4.8, reviews: 141, stock: 29,
      tags: ["lemnos", "cald", "birou"],
      sizes: ML,
      desc: "Santal cremos, echilibrat. Merge la fel de bine în living și în spațiul de lucru.",
      notes: ["Santal", "Cedru", "Ambră"],
      usage: "3–5 picături în apa difuzorului cu ultrasunete.",
    },
    {
      id: "up-bumbac",
      name: "Ulei parfumat Bumbac proaspăt",
      cat: "uleiuri-parfumate",
      price: 14.9,
      art: "oil", hue: 205,
      rating: 4.6, reviews: 110, stock: 54,
      tags: ["proaspăt", "curat", "baie"],
      sizes: ML,
      desc: "Rufe proaspăt spălate. Neutru, curat, potrivit pentru baie și dormitor.",
      notes: ["Bumbac", "Lămâie verde", "Mosc alb"],
      usage: "3–5 picături în apa difuzorului.",
    },

    /* ---- Uleiuri esențiale ---- */
    {
      id: "ue-lavanda",
      name: "Ulei esențial Lavandă 100% pur",
      cat: "uleiuri-esentiale",
      price: 39.9, old: 49.9,
      art: "oil", hue: 262,
      rating: 4.9, reviews: 302, stock: 44,
      tags: ["100% pur", "somn", "relaxare"],
      sizes: ML,
      desc: "Lavandula angustifolia, distilată cu abur. Certificat de analiză disponibil pentru fiecare lot.",
      notes: ["Lavandă"],
      usage: "Aromaterapie: 3–4 picături în difuzor. Masaj: diluează în ulei purtător (max. 2%).",
      bestseller: true,
    },
    {
      id: "ue-eucalipt",
      name: "Ulei esențial Eucalipt",
      cat: "uleiuri-esentiale",
      price: 32.9,
      art: "oil", hue: 165,
      rating: 4.7, reviews: 168, stock: 38,
      tags: ["100% pur", "respirație", "proaspăt"],
      sizes: ML,
      desc: "Eucalyptus globulus. Aroma tăioasă, mentolată — utilă în sezonul rece.",
      notes: ["Eucalipt"],
      usage: "3–4 picături în difuzor. Nu se aplică nediluat pe piele.",
    },
    {
      id: "ue-teatree",
      name: "Ulei esențial Arbore de ceai",
      cat: "uleiuri-esentiale",
      price: 36.9,
      art: "oil", hue: 120,
      rating: 4.7, reviews: 154, stock: 31,
      tags: ["100% pur", "purificare"],
      sizes: ML,
      desc: "Melaleuca alternifolia din Australia. Ierbos, penetrant, cu profil curat.",
      notes: ["Tea tree"],
      usage: "3 picături în difuzor sau diluat 1% în ulei purtător.",
    },
    {
      id: "ue-menta",
      name: "Ulei esențial Mentă",
      cat: "uleiuri-esentiale",
      price: 29.9,
      art: "oil", hue: 150,
      rating: 4.6, reviews: 127, stock: 46,
      tags: ["100% pur", "energie", "concentrare"],
      sizes: ML,
      desc: "Mentha piperita. Rece și limpede — aroma pentru dimineți și ore de lucru lungi.",
      notes: ["Mentă"],
      usage: "2–3 picături în difuzor. Evită seara, e stimulant.",
    },
    {
      id: "ue-portocala",
      name: "Ulei esențial Portocală dulce",
      cat: "uleiuri-esentiale",
      price: 27.9,
      art: "oil", hue: 30,
      rating: 4.8, reviews: 173, stock: 57,
      tags: ["100% pur", "citric", "bună dispoziție"],
      sizes: ML,
      desc: "Citrus sinensis, presat la rece. Solar și prietenos — merge în orice cameră.",
      notes: ["Portocală dulce"],
      usage: "4–5 picături în difuzor. Fotosensibilizant — atenție la aplicarea pe piele.",
    },

    /* ---- Difuzoare ---- */
    {
      id: "df-terra",
      name: "Difuzor cu ultrasunete Terra",
      cat: "difuzoare",
      price: 189, old: 229,
      art: "diffuser", hue: 30,
      rating: 4.8, reviews: 96, stock: 18,
      tags: ["ultrasunete", "300 ml", "lemn deschis"],
      desc: "Rezervor de 300 ml, autonomie de până la 10 ore și oprire automată. Finisaj lemn deschis, discret pe orice mobilă.",
      notes: ["300 ml", "Până la 10 h", "7 culori LED", "Oprire automată"],
      usage: "Umple până la marcaj, adaugă 3–5 picături de ulei, pornește. Curăță rezervorul săptămânal.",
      bestseller: true,
    },
    {
      id: "df-aura",
      name: "Difuzor cu ultrasunete Aura 300 ml",
      cat: "difuzoare",
      price: 219,
      art: "diffuser", hue: 200,
      rating: 4.7, reviews: 74, stock: 12,
      tags: ["ultrasunete", "300 ml", "silențios"],
      desc: "Sub 25 dB — suficient de silențios pentru dormitor. Două moduri de ceață și timer pe 4 trepte.",
      notes: ["300 ml", "< 25 dB", "Timer 1/3/6 h", "Mod intermitent"],
      usage: "Apă la temperatura camerei + 3–5 picături ulei. Nu folosi uleiuri vâscoase.",
      isNew: true,
    },
    {
      id: "df-lotus",
      name: "Arzător ceramic Lotus",
      cat: "difuzoare",
      price: 69.9,
      art: "burner", hue: 20,
      rating: 4.6, reviews: 138, stock: 26,
      tags: ["ceramic", "pastilă", "fără electricitate"],
      desc: "Arzătorul clasic, cu pastilă. Ceramică glazurată manual — fiecare piesă e ușor diferită.",
      notes: ["Ceramică glazurată", "Pastilă inclusă", "Fără cablu"],
      usage: "Apă în cupă + 3–5 picături ulei parfumat, apoi aprinde pastila. Nu lăsa cupa să sece.",
    },
    {
      id: "df-nomad",
      name: "Difuzor Mini Nomad 120 ml",
      cat: "difuzoare",
      price: 129,
      art: "diffuser", hue: 190,
      rating: 4.5, reviews: 61, stock: 21,
      tags: ["ultrasunete", "USB-C", "portabil"],
      desc: "Alimentare USB-C, suficient de mic pentru birou sau bord. Autonomie de 4 ore pe rezervor plin.",
      notes: ["120 ml", "USB-C", "Până la 4 h"],
      usage: "Ideal pentru spații mici (sub 15 m²).",
    },
    {
      id: "df-serena",
      name: "Umidificator & difuzor Serena 500 ml",
      cat: "difuzoare",
      price: 279,
      art: "device", hue: 210,
      rating: 4.7, reviews: 43, stock: 8,
      tags: ["ultrasunete", "500 ml", "umidificare"],
      desc: "Umidifică și parfumează în același timp. Rezervor mare pentru camere de până la 40 m².",
      notes: ["500 ml", "Până la 16 h", "Higrostat", "Oprire automată"],
      usage: "Pentru umidificare simplă, folosește doar apă. Golește rezervorul dacă nu-l folosești câteva zile.",
    },

    /* ---- Bețișoare & Reed ---- */
    {
      id: "rd-vanilie",
      name: "Reed diffuser Vanilie & Tonka 100 ml",
      cat: "betisoare-reed",
      price: 74.9,
      art: "reed", hue: 36,
      rating: 4.7, reviews: 112, stock: 33,
      tags: ["reed", "100 ml", "2–3 luni"],
      desc: "Sticlă de 100 ml cu 8 bețișoare de rattan. Parfumare constantă timp de 2–3 luni, fără flacără.",
      notes: ["100 ml", "8 bețișoare rattan", "2–3 luni"],
      usage: "Întoarce bețișoarele o dată pe săptămână. Mai multe bețișoare = parfum mai intens.",
      bestseller: true,
    },
    {
      id: "rd-cedru",
      name: "Reed diffuser Lemn de cedru 200 ml",
      cat: "betisoare-reed",
      price: 109,
      art: "reed", hue: 100,
      rating: 4.8, reviews: 67, stock: 19,
      tags: ["reed", "200 ml", "4–5 luni"],
      desc: "Format mare pentru hol sau living deschis. Cedru sec, cu o urmă de vetiver.",
      notes: ["200 ml", "10 bețișoare", "4–5 luni"],
      usage: "Așază-l într-o zonă cu curent de aer ușor, nu în bătaia directă a soarelui.",
    },
    {
      id: "bp-lavanda",
      name: "Bețișoare parfumate Lavandă (20 buc)",
      cat: "betisoare-reed",
      price: 19.9,
      art: "reed", hue: 265,
      rating: 4.5, reviews: 205, stock: 88,
      tags: ["bețișoare", "20 buc"],
      desc: "Bețișoare indiene, rulate manual. Ard aproximativ 35 de minute fiecare.",
      notes: ["20 bețișoare", "~35 min / bețișor"],
      usage: "Aprinde, stinge flacăra și așază pe suport. Aerisește camera după ardere.",
    },
    {
      id: "bp-santal",
      name: "Bețișoare parfumate Santal (20 buc)",
      cat: "betisoare-reed",
      price: 19.9,
      art: "reed", hue: 28,
      rating: 4.6, reviews: 178, stock: 76,
      tags: ["bețișoare", "20 buc"],
      desc: "Santal tradițional, aroma de bază a oricărei colecții de bețișoare.",
      notes: ["20 bețișoare", "~35 min / bețișor"],
      usage: "Folosește întotdeauna un suport rezistent la căldură.",
    },
    {
      id: "rd-rezerva",
      name: "Set rezervă bețișoare rattan (10 buc)",
      cat: "betisoare-reed",
      price: 12.9,
      art: "reed", hue: 34,
      rating: 4.4, reviews: 54, stock: 120,
      tags: ["accesoriu", "rattan"],
      desc: "Bețișoare noi de rattan pentru reed diffuser. Schimbă-le la fiecare reumplere.",
      notes: ["10 bețișoare", "25 cm"],
      usage: "Bețișoarele vechi se saturează — înlocuiește-le la fiecare rezervă de lichid.",
    },

    /* ---- Lumânări ---- */
    {
      id: "lm-fig",
      name: "Lumânare parfumată Smochin & Cedru 180 g",
      cat: "lumanari",
      price: 54.9,
      art: "candle", hue: 105,
      rating: 4.8, reviews: 89, stock: 27,
      tags: ["180 g", "ceară vegetală", "45 h"],
      desc: "Ceară vegetală, fitil de bumbac, ardere curată până la 45 de ore. Frunză de smochin peste cedru.",
      notes: ["180 g", "Până la 45 h", "Ceară vegetală", "Fitil de bumbac"],
      usage: "La prima aprindere, lasă să ardă până ceara se topește uniform. Scurtează fitilul la 5 mm.",
      bestseller: true,
    },
    {
      id: "lm-vanilie",
      name: "Lumânare parfumată Vanilie & Caramel 180 g",
      cat: "lumanari",
      price: 49.9,
      art: "candle", hue: 38,
      rating: 4.7, reviews: 121, stock: 34,
      tags: ["180 g", "ceară vegetală", "45 h"],
      desc: "Dulce fără să fie greoaie. Vanilie rotunjită de caramel și un vârf de sare.",
      notes: ["180 g", "Până la 45 h", "Ceară vegetală"],
      usage: "Nu arde mai mult de 4 ore consecutiv.",
    },
    {
      id: "lm-mosc",
      name: "Lumânare parfumată Mosc alb 320 g",
      cat: "lumanari",
      price: 89,
      art: "candle", hue: 250,
      rating: 4.9, reviews: 52, stock: 14,
      tags: ["320 g", "3 fitile", "70 h"],
      desc: "Format mare cu trei fitile, pentru camere spațioase. Mosc alb, pudrat, discret.",
      notes: ["320 g", "3 fitile", "Până la 70 h"],
      usage: "Aprinde toate cele trei fitile simultan pentru o topire uniformă.",
    },
    {
      id: "lm-pastile",
      name: "Set 3 lumânări pastilă parfumate",
      cat: "lumanari",
      price: 24.9,
      art: "candle", hue: 20,
      rating: 4.4, reviews: 96, stock: 65,
      tags: ["set 3", "pastile"],
      desc: "Pastile parfumate pentru arzătoare ceramice sau suporturi decorative. Ard 4 ore fiecare.",
      notes: ["3 bucăți", "~4 h fiecare"],
      usage: "Potrivite pentru arzătoarele ceramice cu cupă.",
    },

    /* ---- Parfumuri de cameră ---- */
    {
      id: "pc-bumbac",
      name: "Parfum de cameră Bumbac & Iris 250 ml",
      cat: "parfumuri-camera",
      price: 44.9,
      art: "spray", hue: 210,
      rating: 4.6, reviews: 143, stock: 42,
      tags: ["spray", "250 ml", "instant"],
      desc: "Pulverizare fină, fără urme. Pentru momentele în care vrei rezultat în trei secunde.",
      notes: ["250 ml", "Pulverizator fin"],
      usage: "Pulverizează în aer, la 30 cm de suprafețe. Nu aplica direct pe lemn lăcuit.",
    },
    {
      id: "pc-citrice",
      name: "Parfum de cameră Citrice & Verbină 250 ml",
      cat: "parfumuri-camera",
      price: 44.9,
      art: "spray", hue: 70,
      rating: 4.7, reviews: 118, stock: 39,
      tags: ["spray", "250 ml", "bucătărie"],
      desc: "Citrice tăioase peste verbină — cel mai bun aliat împotriva mirosurilor de gătit.",
      notes: ["250 ml", "Pulverizator fin"],
      usage: "Ideal în bucătărie, după gătit. Aerisește întâi, apoi pulverizează.",
      isNew: true,
    },
    {
      id: "pc-textil",
      name: "Spray textile & pernă Lavandă 150 ml",
      cat: "parfumuri-camera",
      price: 34.9,
      art: "spray", hue: 262,
      rating: 4.8, reviews: 164, stock: 51,
      tags: ["textile", "150 ml", "somn"],
      desc: "Formulă blândă pentru lenjerie și perne. Fără coloranți, nu pătează.",
      notes: ["150 ml", "Fără coloranți"],
      usage: "Pulverizează pe pernă cu 10 minute înainte de culcare, de la 20 cm distanță.",
      bestseller: true,
    },
    {
      id: "pc-auto",
      name: "Odorizant auto Lemn & Piele",
      cat: "parfumuri-camera",
      price: 24.9,
      art: "spray", hue: 25,
      rating: 4.3, reviews: 87, stock: 73,
      tags: ["auto", "clips ventilație"],
      desc: "Se prinde de grila de ventilație. Intensitate reglabilă, rezistă circa 6 săptămâni.",
      notes: ["Clips ventilație", "~6 săptămâni", "Intensitate reglabilă"],
      usage: "Începe cu intensitatea minimă — în habitaclu parfumul se concentrează repede.",
    },

    /* ---- Seturi cadou ---- */
    {
      id: "sc-relaxare",
      name: "Set cadou Relaxare — difuzor + 2 uleiuri",
      cat: "seturi-cadou",
      price: 249, old: 299,
      art: "giftset", hue: 340,
      rating: 4.9, reviews: 78, stock: 16,
      tags: ["cadou", "difuzor inclus", "ambalat"],
      desc: "Difuzorul Terra alături de uleiurile de lavandă și vanilie, în cutie cadou. Nu mai ai nimic de adăugat.",
      notes: ["Difuzor Terra 300 ml", "Ulei Lavandă 10 ml", "Ulei Vanilie 10 ml", "Cutie cadou inclusă"],
      usage: "Livrat ambalat cadou, fără factură în colet dacă alegi opțiunea la finalizare.",
      bestseller: true,
    },
    {
      id: "sc-start",
      name: "Set cadou Aromaterapie Start — 5 uleiuri esențiale",
      cat: "seturi-cadou",
      price: 149,
      art: "giftset", hue: 320,
      rating: 4.8, reviews: 64, stock: 23,
      tags: ["cadou", "5 uleiuri", "ambalat"],
      desc: "Lavandă, eucalipt, mentă, portocală și tea tree — cele cinci uleiuri de la care pornește oricine.",
      notes: ["5 × 10 ml", "100% pure", "Ghid de utilizare inclus"],
      usage: "Fiecare sticluță are picurător. Ghidul din cutie explică dozajul pentru fiecare.",
    },
    {
      id: "sc-seara",
      name: "Set cadou Seară liniștită — lumânare + reed",
      cat: "seturi-cadou",
      price: 129,
      art: "giftset", hue: 350,
      rating: 4.7, reviews: 41, stock: 20,
      tags: ["cadou", "ambalat"],
      desc: "Lumânarea de smochin și reed diffuser-ul de vanilie, împreună în cutie.",
      notes: ["Lumânare 180 g", "Reed diffuser 100 ml", "Cutie cadou inclusă"],
      usage: "Combinația funcționează cel mai bine în dormitor sau living mic.",
      isNew: true,
    },

    /* ---- Decorațiuni ---- */
    {
      id: "dc-potpourri",
      name: "Potpourri Flori de câmp 200 g",
      cat: "decoratiuni",
      price: 29.9,
      art: "potpourri", hue: 300,
      rating: 4.4, reviews: 73, stock: 44,
      tags: ["potpourri", "200 g"],
      desc: "Flori și petale uscate, parfumate natural. Pentru boluri decorative și rafturi.",
      notes: ["200 g", "Flori uscate naturale"],
      usage: "Reîmprospătează la 4–6 săptămâni cu câteva picături de ulei parfumat.",
    },
    {
      id: "dc-saculeti",
      name: "Săculeți parfumați Lavandă (set 3)",
      cat: "decoratiuni",
      price: 22.9,
      art: "potpourri", hue: 268,
      rating: 4.6, reviews: 156, stock: 82,
      tags: ["săculeți", "set 3", "dulap"],
      desc: "Pentru dulapuri și sertare. Lavandă uscată în săculeți de bumbac.",
      notes: ["3 săculeți", "Bumbac natural"],
      usage: "Strânge ușor săculețul în mână pentru a reactiva parfumul.",
    },
    {
      id: "dc-figurina",
      name: "Figurină parfumată din ceramică",
      cat: "decoratiuni",
      price: 34.9,
      art: "potpourri", hue: 190,
      rating: 4.5, reviews: 48, stock: 0,
      tags: ["ceramică", "reîncărcabilă"],
      desc: "Ceramică poroasă care absoarbe uleiul parfumat și îl eliberează lent. Se reîncarcă la nesfârșit.",
      notes: ["Ceramică poroasă", "Reîncărcabilă"],
      usage: "Aplică 5–8 picături de ulei parfumat direct pe ceramică, la 2 săptămâni.",
    },
  ];

  /* ---- derived helpers ------------------------------------------------ */

  const byId = new Map(products.map((p) => [p.id, p]));
  const catById = new Map(categories.map((c) => [c.slug, c]));

  categories.forEach((c) => {
    c.count = products.filter((p) => p.cat === c.slug).length;
  });

  function get(id) {
    return byId.get(id) || null;
  }

  function categoryOf(product) {
    return catById.get(product.cat) || { name: "", slug: "" };
  }

  /** Price for a product at a given size label (sizes carry a delta). */
  function priceOf(product, sizeLabel) {
    if (!product.sizes || !sizeLabel) return product.price;
    const size = product.sizes.find((s) => s.label === sizeLabel);
    return size ? product.price + size.delta : product.price;
  }

  /**
   * Reference ("was") price for the selected size. The size surcharge applies
   * to the pre-discount price too, otherwise a 50 ml bottle would display a
   * 10 ml crossed-out price and an inflated saving.
   */
  function oldPriceOf(product, sizeLabel) {
    if (!product.old) return null;
    if (!product.sizes || !sizeLabel) return product.old;
    const size = product.sizes.find((s) => s.label === sizeLabel);
    return size ? product.old + size.delta : product.old;
  }

  function formatPrice(value) {
    return (
      value.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
      " lei"
    );
  }

  function stars(rating) {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  global.AL = {
    products,
    categories,
    get,
    categoryOf,
    priceOf,
    oldPriceOf,
    formatPrice,
    stars,
    FREE_SHIPPING_THRESHOLD,
    COURIER_FEE,
  };
})(window);
