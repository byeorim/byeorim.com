// Run with SHARP_MODULE pointing to an installed sharp package if needed.
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const out = fileURLToPath(new URL('.', import.meta.url));
const brand = '#a44636', tint = '#faf1ec';
const ink = '#1b1b1a', paper = '#fbfbfa';

// Shared 45° facets. Circular fillets remain tangent to both adjoining edges.
function roundedPolygon(points, radius) {
  const corners = points.map((p, i) => {
    const prev = points[(i + points.length - 1) % points.length];
    const next = points[(i + 1) % points.length];
    const a = [prev[0] - p[0], prev[1] - p[1]];
    const b = [next[0] - p[0], next[1] - p[1]];
    const la = Math.hypot(...a), lb = Math.hypot(...b);
    const u = a.map(v => v / la), v = b.map(v => v / lb);
    const angle = Math.acos(Math.max(-1, Math.min(1, u[0]*v[0]+u[1]*v[1])));
    const cornerRadius = Array.isArray(radius) ? radius[i] : radius;
    const distance = Math.min(cornerRadius / Math.tan(angle / 2), la * .4, lb * .4);
    const r = distance * Math.tan(angle / 2);
    return {
      entry: p.map((n, j) => n + u[j] * distance),
      exit: p.map((n, j) => n + v[j] * distance),
      r,
      sweep: (-u[0]*v[1]+u[1]*v[0]) > 0 ? 1 : 0,
    };
  });
  const n = x => Number(x.toFixed(3));
  const pair = p => p.map(n).join(' ');
  return `M ${pair(corners[0].entry)} ` + corners.map((c, i) =>
    `${i ? `L ${pair(c.entry)} ` : ''}A ${n(c.r)} ${n(c.r)} 0 0 ${c.sweep} ${pair(c.exit)}`
  ).join(' ') + ' Z';
}
const outer = roundedPolygon([
  [192,192],[304,80],[304,280],[720,280],[720,192],[832,80],
  [832,800],[768,864],[192,864],
// The two 135° bevel joins need larger fillets to read as softly as 90° corners.
], [16, 16, 16, 16, 16, 16, 40, 40, 16]);
// Exactly one connected ㄹ counter; it is a hole, not a painted white glyph.
const counter = roundedPolygon([
  [344,376],[720,376],[720,600],[432,600],[400,632],[400,680],
  [720,680],[720,712],[672,760],[304,760],[304,536],
  [592,536],[624,504],[624,456],[304,456],[304,416],
], 12);
const path = `${outer} ${counter}`;
function svg(color = brand, background = null, scale = 1) {
  const t = 512 * (1 - scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">${background ? `<path fill="${background}" d="M0 0h1024v1024H0z"/>` : ''}<path fill="${color}" fill-rule="evenodd" transform="translate(${t} ${t}) scale(${scale})" d="${path}"/></svg>\n`;
}
const assets = {
  'mark.svg': svg(),
  'mark-white.svg': svg(paper),
  'mark-ink.svg': svg(ink),
  'profile-light.svg': svg(brand, tint, .88),
  'profile-dark.svg': svg(paper, brand, .88),
};
for (const [name, data] of Object.entries(assets)) {
  await writeFile(out + name, data);
  await sharp(Buffer.from(data)).resize(1024).png().toFile(out + name.replace('.svg', '.png'));
}
// A light plate preserves contrast in both light and dark browser tab bars.
const favicon = svg(brand, paper).replace('viewBox="0 0 1024 1024"', 'viewBox="128 48 768 848"');
await writeFile(out + 'favicon.svg', favicon);
for (const size of [16, 32, 48]) {
  await sharp(Buffer.from(favicon)).resize(size, size).png().toFile(out + `favicon-${size}.png`);
}
const tile = (x, y, color, bg, circle = false) => `<g transform="translate(${x} ${y})"><${circle ? 'circle cx="180" cy="180" r="180"' : 'rect width="360" height="360" rx="28"'} fill="${bg}"/><svg width="360" height="360" viewBox="0 0 1024 1024"><path fill="${color}" fill-rule="evenodd" transform="translate(61.44 61.44) scale(.88)" d="${path}"/></svg></g>`;
const board = `<svg xmlns="http://www.w3.org/2000/svg" width="1520" height="1040" viewBox="0 0 1520 1040"><path fill="${paper}" d="M0 0h1520v1040H0z"/><g fill="${ink}" font-family="Arial,sans-serif"><text x="80" y="72" font-size="27" font-weight="600">ByeoRim / Oxide #A44636</text><text x="80" y="110" font-size="17">One silhouette. One continuous counter.</text></g><svg x="40" y="160" width="660" height="660" viewBox="0 0 1024 1024"><path fill="${brand}" fill-rule="evenodd" d="${path}"/></svg>${tile(720,190,paper,brand,true)}${tile(1090,190,brand,tint,true)}${tile(720,580,brand,tint)}${tile(1090,580,paper,brand)}<g fill="${ink}" font-family="Arial,sans-serif" font-size="18"><text x="80" y="910">Actual pixel sizes</text></g></svg>`;
// Build all views from the same path, without regenerating the symbol.
const base = await sharp(Buffer.from(board)).png().toBuffer();
const overlays = [];
for (const [i, size] of [16, 32, 48, 64].entries()) {
  overlays.push({ input: await sharp(Buffer.from(favicon)).resize(size, size).png().toBuffer(), left: 80 + i * 135, top: 935 });
}
await sharp(base).composite(overlays).png().toFile(out + 'preview.png');
await sharp(Buffer.from(svg(brand, paper))).resize(1600).png().toFile(out + 'mark-refined-large.png');
console.log('Built SVG originals, PNG profiles, favicon PNGs, and preview.png');
