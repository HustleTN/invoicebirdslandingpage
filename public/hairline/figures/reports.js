/**
 * Reports: a report sheet with a bar chart standing on it, one bar a month,
 * a trend line drawn across the bar tops, and a small total card raised at
 * the side whose figure fills as the months grow. The pointer's x grows the
 * months one after another, each bar on its own spring. The bright stroke is
 * the trend line. The slider is how far apart the bars start growing.
 *
 * The pattern: scrub, spread over a few items, with one line tied to them.
 */
const {
  Cam, clamp, facing, fit, lerp, open, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 72, L = 52, ST = 1.2, BW = 9, BD = 9, BY = 26, REST = 0.6;
const BARS = [
  { x: 6, low: 6, high: 13 },
  { x: 18, low: 8, high: 19 },
  { x: 30, low: 7, high: 24 },
  { x: 42, low: 10, high: 33 },
];
// the total card: a raised tile in the far corner, its figure a strip that fills
const CARD = { x0: 50, y0: 5, x1: 68, y1: 19, h: 2.6 };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value;

  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [W, L, 0], [W, 0, 0], [0, L, 0], [BARS[3].x + BW / 2, BY, ST + 33]], 200, 162);
  const P = proj(C), front = facing(C);
  const box = (parent, x0, y0, x1, y1, z0, z1, r, b) => {
    const [ring, inner] = rings(x0, y0, x1, y1, r, b);
    const el = solid(parent);
    put(el, prism(P, front, ring, inner, z0, z1));
    return el;
  };

  const g = mk("g", {}, svg);
  // the sheet, its title and the rules under the chart
  box(g, 0, 0, W, L, 0, ST, 3, 1.2);
  const on = (x, y) => P(x, y, ST);
  mk("path", { class: "nf", d: poly([on(6, 6), on(28, 6), on(28, 10), on(6, 10)]) }, g);
  mk("path", { class: "nf lo", d: open([on(6, 14), on(20, 14)]) + open([on(4, BY + BD + 4), on(54, BY + BD + 4)]) + open([on(4, BY + BD + 8), on(40, BY + BD + 8)]) }, g);

  // the total card, then its filling figure
  box(g, CARD.x0, CARD.y0, CARD.x1, CARD.y1, ST, ST + CARD.h, 2, 0.7);
  const top = ST + CARD.h, onCard = (x, y) => P(x, y, top);
  mk("path", { class: "nf lo", d: open([onCard(CARD.x0 + 3, CARD.y0 + 4), onCard(CARD.x0 + 11, CARD.y0 + 4)]) }, g);
  const fill = mk("path", { class: "nf" }, g);

  // bars, far to near, so a nearer one covers a farther one; the trend line over them
  const bars = BARS.map((b) => ({ ...b, el: solid(mk("g", {}, g)), h: spring(lerp(b.low, b.high, REST), { eps: 0.01 }) }));
  const trend = mk("path", { class: "nf hi" }, g);
  const dots = mk("path", { class: "nf hi" }, g);
  let drawn = "";

  function draw() {
    const key = bars.map((b) => b.h.x.toFixed(2)).join("|");
    if (key === drawn) return;
    drawn = key;
    for (const b of bars) {
      const [ring, inner] = rings(b.x, BY, b.x + BW, BY + BD, 1.6, 0.6);
      put(b.el, prism(P, front, ring, inner, ST, ST + b.h.x));
    }
    const tops = bars.map((b) => P(b.x + BW / 2, BY + BD / 2, ST + b.h.x + 3));
    trend.setAttribute("d", open(tops));
    dots.setAttribute("d", tops.map(([x, y]) => `M ${x - 1.6} ${y} a 1.6 1.6 0 1 0 3.2 0 a 1.6 1.6 0 1 0 -3.2 0`).join(" "));
    // the total's strip fills with the months
    const k = (bars[3].h.x - bars[3].low) / (bars[3].high - bars[3].low);
    const len = lerp(2, 12, clamp(k, 0, 1));
    fill.setAttribute("d", poly([onCard(CARD.x0 + 3, CARD.y0 + 8), onCard(CARD.x0 + 3 + len, CARD.y0 + 8), onCard(CARD.x0 + 3 + len, CARD.y0 + 11), onCard(CARD.x0 + 3, CARD.y0 + 11)]));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    for (const b of bars) if (stepS(b.h, dt)) moving = true;
    draw();
    return moving;
  });
  bag.add(B.unregister);

  function grow(t) {
    bars.forEach((b, i) => {
      b.h.t = lerp(b.low, b.high, clamp(t * (1 + 3 * gap) - i * gap, 0, 1));
    });
    read.textContent = `month ${Math.round(clamp(t, 0, 1) * 100)}%`;
    B.wake();
  }
  grow(REST);

  bag.add(pointer(stage, {
    move: ([x]) => grow(clamp((x - 110) / 190, 0, 1)),
    leave: () => grow(REST),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { gap = v; grow(REST); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "reports",
  means: "A report: move across to grow each month's bar in turn, with the trend line and total following.",
  rules: [2, 3, 5, 8],
  range: [0.1, 0.2, 0.3],
  tour: [[110, 170], [200, 170], [300, 170], [140, 170], null],
  mount,
});
