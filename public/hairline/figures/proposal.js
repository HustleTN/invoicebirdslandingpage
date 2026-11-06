/**
 * Proposal: a proposal pack, shown as an exploded stack of three pages
 * floating one above another: pricing at the bottom, the scope in the
 * middle, the cover on top. The pointer's x closes the stack into one
 * document; once it has settled, a round badge with a check rises from the
 * cover's corner: accepted. The bright stroke is the cover's title while the
 * pack is open, then the badge. The slider is how far apart the pages float
 * at rest.
 *
 * The pattern: scrub to close, then one pop.
 */
const {
  Cam, clamp, facing, fit, lerp, open, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 54, L = 70, ST = 1.1, BADGE = [W - 13, L - 14], BADGE_R = 8, BADGE_H = 2.4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spread = value;

  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [W, L, 0], [W, 0, 0], [0, L, 0], [0, 0, 2 * (ST + 14) + ST]], 200, 160);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, W, L, 3, 1.1);
  // bottom to top: pricing, scope, cover; each a plate and the marks on its face
  const pages = [0, 1, 2].map(() => {
    const grp = mk("g", {}, g);
    return { plate: solid(grp), marks: mk("path", { class: "nf lo" }, grp), bars: mk("path", { class: "nf" }, grp) };
  });
  const badgeG = mk("g", {}, g);
  const badge = solid(badgeG);
  const check = mk("path", { class: "nf hi" }, badgeG);

  const gap = spring(value, { eps: 0.01 });
  const pop = spring(0, { eps: 0.002, k: 180, c: 14 });
  let drawn = "", title = null;

  const flat = (z) => (x, y) => P(x, y, z);
  const rect = (on, x0, y0, x1, y1) => poly([on(x0, y0), on(x1, y0), on(x1, y1), on(x0, y1)]);

  function draw() {
    const key = `${gap.x.toFixed(3)}|${pop.x.toFixed(4)}`;
    if (key === drawn) return;
    drawn = key;
    const z0 = (i) => i * (ST + gap.x);
    pages.forEach((pg, i) => {
      const z = z0(i);
      put(pg.plate, prism(P, front, pr, pi, z, z + ST));
      const on = flat(z + ST);
      let marks = "", bars = "";
      if (i === 0) {
        // pricing: item rules, then the total box
        for (let k = 0; k < 4; k++) marks += open([on(8, 12 + k * 7), on(W - 8, 12 + k * 7)]);
        bars += rect(on, W - 26, 46, W - 8, 54);
      } else if (i === 1) {
        // scope: three short blocks, each with its lines
        for (let k = 0; k < 3; k++) {
          bars += rect(on, 8, 10 + k * 17, 13, 15 + k * 17);
          marks += open([on(17, 11 + k * 17), on(W - 10, 11 + k * 17)]) + open([on(17, 15 + k * 17), on(W - 18, 15 + k * 17)]);
        }
      } else {
        // the cover: logo, title, prepared-for line
        bars += rect(on, 8, 8, 18, 14) + rect(on, 8, 22, 40, 27);
        marks += open([on(8, 32), on(30, 32)]) + open([on(8, 37), on(24, 37)]);
      }
      pg.marks.setAttribute("d", marks);
      pg.bars.setAttribute("d", bars);
      if (i === 2) title = pg.bars;
    });

    // the accepted badge: grows from the cover's corner and rises a little, with its check
    const top = z0(2) + ST, b = clamp(pop.x, 0, 1.2);
    if (b < 0.02) {
      badge.sil.setAttribute("d", "");
      badge.cr.setAttribute("d", "");
      check.setAttribute("d", "");
    } else {
      const r = BADGE_R * b, z1 = top + BADGE_H * b;
      const [br, bi] = rings(BADGE[0] - r, BADGE[1] - r, BADGE[0] + r, BADGE[1] + r, r, Math.min(0.8, r / 3));
      put(badge, prism(P, front, br, bi, top, z1));
      const c = (u, v) => P(BADGE[0] + u * b, BADGE[1] + v * b, z1);
      // a check that reads upright on screen, worked back into the badge's plane
      check.setAttribute("d", open([c(-2.6, 2.6), c(1.4, 3.2), c(0.6, -4.6)]));
    }
    badge.sil.classList.toggle("hi", b >= 0.02);
    title.classList.toggle("hi", b < 0.02);
  }

  const B = register(stage, (dt) => {
    let moving = stepS(gap, dt);
    if (stepS(pop, dt)) moving = true;
    draw();
    return moving;
  });
  bag.add(B.unregister);

  function close(t) {
    gap.t = lerp(spread, 0, clamp(t / 0.7, 0, 1));
    pop.t = t >= 0.85 ? 1 : 0;
    read.textContent = pop.t === 1 ? "accepted" : t >= 0.7 ? "closed" : "open";
    B.wake();
  }
  close(0);

  bag.add(pointer(stage, {
    move: ([x]) => close(clamp((x - 110) / 190, 0, 1)),
    leave: () => close(0),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { spread = v; gap.t = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "proposal",
  means: "A proposal pack: move across to close its pages into one document, then a badge marks it accepted.",
  rules: [2, 3, 5, 8],
  range: [6, 12, 14],
  tour: [[110, 160], [200, 160], [310, 160], null],
  mount,
});
