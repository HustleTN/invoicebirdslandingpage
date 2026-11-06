/**
 * Estimate: a clipboard holding one sheet, its line items laid on it as thin
 * raised strips, a description and an amount each, and the total below them.
 * The item under the pointer lifts and its neighbours rise less, staggered
 * outwards on the 700ms curve. At rest the approved total is the one bright
 * stroke. The slider is how high an item lifts.
 *
 * The pattern: one of many. Tweens, a stagger by distance, and a hit test on
 * the rest plane of the strips, which never moves.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, rrect, ringAt, poly, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 62, L = 86, BT = 2.2, ST = 0.6, RT = 0.9, ROWS = [32, 41, 50, 59], TOTAL = 71, BAND = 4.5, STEP = 45;
const SHEET = BT + ST, RTOP = SHEET + RT;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let high = value;

  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [W, L, 0], [W, 0, 0], [0, L, 0], [19, -3, 7.4], [9, ROWS[0] - 2, RTOP + 14]], 200, 172);
  const P = proj(C), front = facing(C);
  const block = (parent, x0, y0, x1, y1, z0, z1, r, b) => {
    const [ring, inner] = rings(x0, y0, x1, y1, r, b);
    const el = solid(parent);
    put(el, prism(P, front, ring, inner, z0, z1));
    return { el, ring, inner };
  };

  const g = mk("g", {}, svg);
  block(g, 0, 0, W, L, 0, BT, 5, 1.6);
  block(g, 4, 11, W - 4, L - 4, BT, SHEET, 1.6, 0.8);
  // the clip, across the board's top edge, and its lever
  block(g, 18, -2.5, 44, 10, BT, 6, 3, 1.2);
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(27, 1, 35, 4.5, 1.7, 4), 6)) }, g);
  block(g, 23, 5, 39, 8.5, 6, 7.4, 1.6, 0.6);
  block(g, 9, 17, 30, 22, SHEET, RTOP, 1.4, 0.6);

  // line items: a description and an amount each, painted back to front
  const strip = (y, z, x0, x1) => {
    const [ring, inner] = rings(x0, y - 2.1, x1, y + 2.1, 1.3, 0.55);
    return prism(P, front, ring, inner, z, z + RT);
  };
  const rows = [...ROWS, TOTAL].map((y, i) => {
    const grp = mk("g", {}, g), total = i === ROWS.length;
    const desc = total ? null : solid(grp), amt = solid(grp);
    return { y, total, desc, amt, z: tween(0), drawn: NaN, x0: total ? 30 : 42 };
  });

  function drawRow(r, lift) {
    if (lift === r.drawn) return;
    r.drawn = lift;
    if (r.desc) put(r.desc, strip(r.y, SHEET + lift, 9, 37));
    put(r.amt, strip(r.y, SHEET + lift, r.x0, 53));
  }

  /** Which item is under the point, read on the strips' rest plane: -1 when none. */
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, RTOP);
    if (x < 6 || x > 56) return -1;
    let best = -1, d = BAND;
    rows.forEach((r, i) => { if (Math.abs(y - r.y) < d) { d = Math.abs(y - r.y); best = i; } });
    return best;
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const r of rows) {
      drawRow(r, tval(r.z, now));
      if (!tdone(r.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  const mark = (a) => rows.forEach((r, i) => {
    const on = a < 0 ? r.total : i === a;
    r.amt.sil.classList.toggle("hi", on);
    if (r.desc) r.desc.sil.classList.toggle("hi", on);
  });
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? 0;
    act = a;
    rows.forEach((r, i) => {
      const k = Math.abs(i - a), lift = a < 0 ? 0 : k === 0 ? high : k === 1 ? high * 0.35 : high * 0.12;
      tset(r.z, lift, now, Math.abs(i - from) * STEP);
    });
    mark(a);
    read.textContent = a < 0 ? "rest" : rows[a].total ? "total" : `item ${a + 1}`;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { high = clamp(v, 0, 16); const a = act; act = null; setActive(a); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "estimate",
  means: "An estimate on a clipboard: the line item under the pointer lifts, and its neighbours rise less.",
  rules: [1, 2, 4, 8],
  range: [5, 9, 14],
  tour: [[170, 150], [215, 175], [250, 205], null],
  mount,
});
