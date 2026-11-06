/**
 * Contract: an agreement lying flat, its clauses as dim rules and a signature
 * line at the foot. The pointer's x scrubs a pen along that line, and the
 * signature is written up to the pen; at rest it is complete, the pen lifted
 * at its end, and the signature is the one bright stroke. The slider is the
 * number of loops in the signature.
 *
 * The pattern: scrub. Two springs, how far the pen has written and how high
 * it is lifted; the pen is the hull of its tip and two round sections.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 60, L = 82, T = 1.4, X0 = 9, X1 = 50, YS = 66, LEN = 44, RAD = 2.1;
const VIEW = [0.612, 0.612, 0.5]; // toward the camera at Cam(45, 0.5): which side of the pen is seen
const AXIS = norm([0.38, -0.34, 0.86]); // from the pen's tip to its end

function norm(v) { const n = Math.hypot(...v); return v.map((c) => c / n); }
const add = (a, b, k = 1) => a.map((c, i) => c + b[i] * k);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const E1 = norm(cross(AXIS, [0, 0, 1])), E2 = cross(AXIS, E1);

/** The signature: a prolate cycloid along the line, so it loops like handwriting. */
function curve(n) {
  const pts = [];
  for (let k = 0; k <= 180; k++) {
    const t = k / 180, a = t * Math.PI * 2 * n;
    const r = 3.6 * (1 - 0.55 * t) * (0.75 + 0.25 * Math.sin(a * 0.37));
    pts.push([X0 + (X1 - X0) * t - r * 0.85 * Math.sin(a), YS - 1.2 - r * (1 - Math.cos(a)), T]);
  }
  return pts;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sig = curve(value);

  const C = Cam(45, 0.5, 2.6);
  const end = (tip) => add(tip, AXIS, LEN);
  fit(C, [[0, 0, 0], [W, L, 0], [W, 0, 0], [0, L, 0], end([X0, YS, T]), end([X1 + 4, YS - 3, T + 9])], 200, 170);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, W, L, 3, 1.2);
  put(solid(g), prism(P, front, sr, si, 0, T));
  const on = (x, y) => P(x, y, T);
  mk("path", { class: "nf", d: seg(on(9, 9), on(36, 9)) }, g);
  let clauses = "";
  for (let k = 0; k < 8; k++) clauses += seg(on(k % 4 === 0 ? 9 : 13, 18 + k * 5), on(k % 4 === 3 ? 34 : 51, 18 + k * 5));
  mk("path", { class: "nf lo", d: clauses }, g);
  mk("path", { class: "nf", d: seg(on(X0, YS), on(X1 + 1, YS)) }, g);
  mk("path", { class: "nf lo", d: seg(on(X0, YS + 5), on(26, YS + 5)) }, g);

  const ink = mk("path", { class: "nf hi" }, g);
  const pen = mk("g", {}, g);
  const body = mk("path", { class: "sil" }, pen), grip = mk("path", { class: "nf lo" }, pen);
  const cap = mk("path", { class: "nf lo" }, pen), clip = mk("path", { class: "nf" }, pen);

  const done = spring(1, { eps: 0.002 }), lift = spring(1, { eps: 0.005 });
  let drawn = "";

  /** A round section of the pen at distance d from the tip; `seen` keeps the half facing the camera. */
  const section = (tip, d, r, seen) => {
    const c = add(tip, AXIS, d), out = [];
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2, o = add(E1.map((v) => v * Math.cos(a) * r), E2, Math.sin(a) * r);
      if (!seen || dot(o, VIEW) > 0) out.push({ a, p: P(...add(c, o)) });
    }
    if (seen) out.sort((x, y) => ((x.a + Math.PI) % (Math.PI * 2)) - ((y.a + Math.PI) % (Math.PI * 2)));
    return out.map((q) => q.p);
  };

  function draw(s, h) {
    const key = s.toFixed(4) + h.toFixed(4);
    if (key === drawn) return;
    drawn = key;
    const n = Math.max(1, Math.round(s * (sig.length - 1)));
    ink.setAttribute("d", open(sig.slice(0, n + 1).map((p) => P(...p))));
    const at = sig[n], tip = add(at, [3.5, -2, 9], h);
    body.setAttribute("d", poly(hull([P(...tip), ...section(tip, 6, 1.5, false), ...section(tip, LEN, RAD, false)])));
    grip.setAttribute("d", open(section(tip, 15, RAD, true)));
    cap.setAttribute("d", poly(section(tip, LEN, RAD, false)));
    const face = norm(add(VIEW, AXIS, -dot(VIEW, AXIS)));
    clip.setAttribute("d", seg(P(...add(add(tip, AXIS, 27), face, RAD + 0.6)), P(...add(add(tip, AXIS, 41), face, RAD + 0.6))));
  }

  const B = register(stage, (dt) => {
    const a = stepS(done, dt), b = stepS(lift, dt);
    draw(clamp(done.x, 0, 1), clamp(lift.x, 0, 1));
    return a || b;
  });
  bag.add(B.unregister);

  function aim(s, h) {
    done.t = s;
    lift.t = h;
    read.textContent = h === 1 ? "rest" : `signed ${Math.round(s * 100)}%`;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: ([x]) => aim(clamp((x - 120) / 170, 0.02, 1), 0),
    leave: () => aim(1, 1),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { sig = curve(v); drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "contract",
  means: "A contract and its pen: move across the signature line to write the signature up to the pen.",
  rules: [5, 6, 8, 10],
  range: [3, 4, 6],
  tour: [[130, 190], [210, 200], [300, 180], null],
  mount,
});
