/**
 * Payment: a card terminal with its screen and keypad, and a card held above
 * it, leaning. The nearer the pointer comes to the terminal, measured on the
 * ground, the lower and flatter the card; close enough, it taps, and the
 * screen takes the bright stroke: received. At rest the card hovers and its
 * edge is the bright stroke. The slider is the reach, in world units.
 *
 * The pattern: a field of one. Two springs, height and lean, from the
 * distance on the ground plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, lerp, poly, prism, proj, rings, ringAt, rrect, spring, stepS, unproj,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const TW = 40, TL = 58, TH = 9, CX = 20, CY = 41, HU = 25, HV = 16, CT = 0.9;
const UP = 30, TAP = TH + 2.6, LEAN = -16, HOME = [20, 30];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, near = null;

  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, 0, 0], [TW, TL, 0], [TW, 0, 0], [0, TL, 0], [CX - HU, CY - HV, UP + 6], [CX + HU, CY + HV, UP], [CX - HU, CY + HV, TAP]], 200, 170);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, TW, TL, 7, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TH));
  const screen = mk("path", { class: "nf", d: poly(ringAt(P, rrect(7, 6, TW - 7, 24, 2.6, 4), TH)) }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(9, 8, TW - 9, 22, 1.8, 4), TH)) }, g);
  for (let k = 0; k < 12; k++) place(flatDot(g, C, 1.1, k === 11 ? "dot m" : "dot off"), P(11 + (k % 3) * 9, 31 + Math.floor(k / 3) * 6.5, TH));

  // the card: a thin plate in its own leaning plane, with a chip and its number in dot groups
  const drops = mk("path", { class: "nf dash" }, g);
  const card = mk("g", {}, g);
  const back = mk("path", { class: "lo" }, card), face = mk("path", { class: "sil" }, card);
  const chip = mk("path", { class: "nf" }, card);
  const digits = [];
  for (let k = 0; k < 16; k++) digits.push(flatDot(card, C, 0.55, k < 4 ? "dot m" : "dot off"));
  const outline = rrect(-HU, -HV, HU, HV, 3, 5), chipRing = rrect(-17, -7, -9, -1, 1.4, 4);

  const h = spring(UP, { eps: 0.01 }), lean = spring(LEAN, { eps: 0.01 });
  let drawn = "";

  function draw(z, th) {
    const key = z.toFixed(3) + th.toFixed(3);
    if (key === drawn) return;
    drawn = key;
    const s = Math.sin((th * Math.PI) / 180), c = Math.cos((th * Math.PI) / 180);
    const w = (u, v, d = 0) => P(CX + u, CY + v * c + d * s, z + v * s - d * c);
    face.setAttribute("d", poly(outline.map((q) => w(q.u, q.v))));
    back.setAttribute("d", poly(outline.map((q) => w(q.u, q.v, CT))));
    chip.setAttribute("d", poly(chipRing.map((q) => w(q.u, q.v))));
    digits.forEach((el, k) => place(el, w(-17 + Math.floor(k / 4) * 9 + (k % 4) * 1.8, 8)));
    drops.setAttribute("d", [[-HU + 3, HV], [HU - 3, HV]].map(([u, v]) => {
      const a = w(u, v), b = P(CX + u, CY + v * c, 0);
      return `M${a[0]},${a[1]}L${b[0]},${b[1]}`;
    }).join(""));
  }

  const B = register(stage, (dt) => {
    const a = stepS(h, dt), b = stepS(lean, dt);
    draw(h.x, lean.x);
    return a || b;
  });
  bag.add(B.unregister);

  function retarget() {
    const k = near ? clamp(near / reach, 0, 1) : 1, ease = k * k * (3 - 2 * k);
    h.t = lerp(TAP, UP, ease);
    lean.t = lerp(0, LEAN, ease);
    const paid = near !== null && h.t < TAP + 1.5;
    screen.classList.toggle("hi", paid);
    face.classList.toggle("hi", !paid);
    read.textContent = near === null ? "rest" : paid ? "paid" : `tap ${Math.round((1 - ease) * 100)}%`;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      near = Math.max(0.001, Math.hypot(x - HOME[0], y - HOME[1]) - 12);
      retarget();
    },
    leave: () => { near = null; retarget(); },
  }));
  retarget();
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "payment",
  means: "A card over a payment terminal: bring the pointer in to lower the card until it taps and the screen lights.",
  rules: [1, 3, 4, 5],
  range: [30, 55, 90],
  tour: [[330, 120], [250, 170], [205, 205], null],
  mount,
});
