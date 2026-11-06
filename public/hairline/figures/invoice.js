/**
 * Invoice: an approved estimate and a new invoice side by side. Each line
 * item, a description and an amount, arcs from its place on the estimate to
 * the same place on the invoice, leaving a dashed slot behind. The pointer's
 * x sets how far the carrying has gone; the items follow one after another,
 * each on its own spring. At rest one has landed, one is in flight and one
 * waits. The bright stroke is the item being carried, or the invoice total
 * once all have landed. The slider is the gap between items.
 *
 * The pattern: scrub, spread over a few items.
 */
const {
  Cam, circ, clamp, facing, fit, lerp, poly, prism, proj, rings, ringAt, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SW = 46, SL = 64, ST = 1.2, GAP = 16, IX = SW + GAP, RT = 0.9, ARC = 13;
const ROWS = [24, 33, 42], REST = [1, 0.5, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value;

  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [IX + SW, SL, 0], [IX + SW, 0, 0], [0, SL, 0], [IX / 2 + 7, ROWS[0], ST + ARC + RT]], 200, 170);
  const P = proj(C), front = facing(C);
  const box = (parent, x0, y0, x1, y1, z0, z1, r, b) => {
    const [ring, inner] = rings(x0, y0, x1, y1, r, b);
    const el = solid(parent);
    put(el, prism(P, front, ring, inner, z0, z1));
    return el;
  };
  // an item's slot: two dashed outlines just inside its footprint, so a seated item hides them
  const slot = (parent, x0, y) => mk("path", {
    class: "nf dash",
    d: [[x0 + 0.6, x0 + 20.4], [x0 + 24.6, x0 + 31.4]].map(([a, b]) => poly(ringAt(P, rrect(a, y - 1.6, b, y + 1.6, 1, 4), ST))).join(""),
  }, parent);

  const g = mk("g", {}, svg);
  // the estimate, then the invoice in front of it: sheet, header, slots
  for (const x of [0, IX]) {
    box(g, x, 0, x + SW, SL, 0, ST, 2.6, 1);
    box(g, x + 7, 9, x + 22, 13, ST, ST + RT, 1.3, 0.5);
    for (const y of ROWS) slot(g, x + 7, y);
  }
  // the estimate's approval stamp; the invoice's total, bright once every item has landed
  const stamp = (r) => poly(circ(r, 24).map((q) => P(31 + q.u, 53 + q.v, ST)));
  mk("path", { class: "nf", d: stamp(5.2) }, g);
  mk("path", { class: "nf lo", d: stamp(3.4) }, g);
  const total = box(g, IX + 22, 51, IX + 39, 56, ST, ST + RT, 1.3, 0.5);

  const items = ROWS.map((y, i) => {
    const grp = mk("g", {}, g);
    return { y, desc: solid(grp), amt: solid(grp), p: spring(REST[i], { eps: 0.001 }), drawn: NaN };
  });

  function drawItem(it, p) {
    if (p === it.drawn) return;
    it.drawn = p;
    const x = lerp(7, IX + 7, p), z = ST + ARC * Math.sin(Math.PI * clamp(p, 0, 1));
    const strip = (x0, x1) => {
      const [ring, inner] = rings(x0, it.y - 2.1, x1, it.y + 2.1, 1.3, 0.55);
      return prism(P, front, ring, inner, z, z + RT);
    };
    put(it.desc, strip(x, x + 21));
    put(it.amt, strip(x + 24, x + 32));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    for (const it of items) { if (stepS(it.p, dt)) moving = true; drawItem(it, it.p.x); }
    return moving;
  });
  bag.add(B.unregister);

  /** The bright stroke: the first item not yet landed, or the total when all have. */
  function mark() {
    const next = items.find((it) => it.p.t < 1);
    items.forEach((it) => [it.desc, it.amt].forEach((s) => s.sil.classList.toggle("hi", it === next)));
    total.sil.classList.toggle("hi", !next);
  }

  function carry(t) {
    items.forEach((it, i) => { it.p.t = t === null ? REST[i] : clamp(t * (1 + 2 * gap) - i * gap, 0, 1); });
    const landed = items.filter((it) => it.p.t === 1).length;
    read.textContent = t === null ? "rest" : `carried ${landed}/3`;
    mark();
    B.wake();
  }
  carry(null);

  let at = null;
  bag.add(pointer(stage, {
    move: ([x]) => { at = clamp((x - 120) / 170, 0, 1); carry(at); },
    leave: () => { at = null; carry(null); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { gap = v; if (at !== null) carry(at); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "invoice",
  means: "An approved estimate becomes an invoice: move across to carry each line item over to the invoice.",
  rules: [2, 3, 5, 8],
  range: [0.08, 0.18, 0.3],
  tour: [[130, 170], [210, 170], [300, 180], null],
  mount,
});
