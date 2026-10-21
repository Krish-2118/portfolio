// Prepares the textured Red Bull RB22 for the site: splits its single merged mesh into named parts so the garage
// strip-down and wheel spin can find them, makes the decal layers transparent and compresses geometry + textures.
//   npm run model:rb22 [-- <source.glb> <output.glb>]
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, meshopt, prune, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';

const [src = 'untitled.glb', out = 'public/models/rb22.glb'] = process.argv.slice(2);

// the source exports decals with alpha but marks every material OPAQUE, which paints black boxes over the livery
const TRANSPARENT = /decal|number|glass|clearled/;
const WHEEL = /wheel_hub|sidewall|discs/;
const COCKPIT = /steeringwheel|sw_decals|LCD|clearled|kers_blue/;
// Car11's part detection also reads material and texture names, so drop words like "driver" or "rear_light" from them
const clean = s => s.replace(/\.(\d+|png)$/, '').replace(/^redbull_/, '').replace(/driver/g, 'race').replace(/rear_light/g, 'lamp').replace(/clearled/g, 'leds');

// source axes: x = right, y = forward (front wing at +y), -z = up
const part = (mat, b) => {
  const c = b.min.map((v, i) => (v + b.max[i]) / 2), s = b.min.map((v, i) => b.max[i] - v), along = c[1], up = -c[2];
  if (WHEEL.test(mat)) return `wheel_${along > 0 ? 'F' : 'R'}${c[0] > 0 ? 'L' : 'R'}`;
  if (/rear_light/.test(mat) && Math.abs(c[0]) < 0.1 && along < -2.3) return 'rain_light';
  if (COCKPIT.test(mat) || (Math.abs(c[0]) < 0.16 && along > 0.6 && along < 0.82 && up > 0.45 && up < 0.72 && s[1] < 0.2)) return 'steering wheel';
  if (/cinture/.test(mat)) return 'seat belts';
  if (along > 2.2 && up < 0.5) return 'front_wing';
  if (along < -1.95 && up > 0.45 && s[1] < 0.8) return 'rear_wing';
  return 'body';
};

// connected components per triangle; vertices split for UV/normal seams are joined by position
const components = prim => {
  const pos = prim.getAttribute('POSITION'), ia = prim.getIndices().getArray(), n = pos.getCount(), v = [0, 0, 0];
  const par = Int32Array.from({ length: n }, (_, i) => i);
  const find = i => { while (par[i] !== i) i = par[i] = par[par[i]]; return i; };
  const join = (a, b) => { a = find(a); b = find(b); if (a !== b) par[a] = b; };
  const seen = new Map();
  for (let i = 0; i < n; i++) { const k = pos.getElement(i, v).map(x => Math.round(x * 1e4)).join(); seen.has(k) ? join(i, seen.get(k)) : seen.set(k, i); }
  for (let t = 0; t < ia.length; t += 3) { join(ia[t], ia[t + 1]); join(ia[t], ia[t + 2]); }
  const boxes = new Map();
  for (let i = 0; i < n; i++) {
    pos.getElement(i, v); const r = find(i); let b = boxes.get(r);
    if (!b) boxes.set(r, (b = { min: [...v], max: [...v] }));
    for (let j = 0; j < 3; j++) { b.min[j] = Math.min(b.min[j], v[j]); b.max[j] = Math.max(b.max[j], v[j]); }
  }
  return { root: find, boxes };
};

// copy the given triangles of a primitive into a new, compact primitive
const extract = (doc, prim, tris) => {
  const ia = prim.getIndices().getArray(), remap = new Map(), order = [];
  const idx = new Uint32Array(tris.length * 3);
  tris.forEach((t, k) => { for (let j = 0; j < 3; j++) { const o = ia[t * 3 + j]; if (!remap.has(o)) { remap.set(o, order.length); order.push(o); } idx[k * 3 + j] = remap.get(o); } });
  const buffer = doc.getRoot().listBuffers()[0], out = doc.createPrimitive().setMaterial(prim.getMaterial()).setMode(prim.getMode());
  out.setIndices(doc.createAccessor().setType('SCALAR').setArray(idx).setBuffer(buffer));
  for (const sem of prim.listSemantics()) {
    const a = prim.getAttribute(sem), size = a.getElementSize(), src = a.getArray(), arr = new src.constructor(order.length * size);
    order.forEach((o, i) => arr.set(src.subarray(o * size, o * size + size), i * size));
    out.setAttribute(sem, doc.createAccessor().setType(a.getType()).setArray(arr).setNormalized(a.getNormalized()).setBuffer(buffer));
  }
  return out;
};

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(src);
const root = doc.getRoot();

const counts = {};
for (const node of root.listNodes().filter(n => n.getMesh())) {
  const parts = new Map(); // part name -> Mesh
  for (const prim of node.getMesh().listPrimitives()) {
    const mat = prim.getMaterial().getName(), { root: find, boxes } = components(prim), ia = prim.getIndices().getArray(), byPart = new Map();
    for (let t = 0; t < ia.length / 3; t++) {
      const p = part(mat, boxes.get(find(ia[t * 3])));
      (byPart.get(p) || byPart.set(p, []).get(p)).push(t);
    }
    for (const [p, tris] of byPart) {
      if (!parts.has(p)) parts.set(p, doc.createMesh(p));
      parts.get(p).addPrimitive(extract(doc, prim, tris));
      counts[p] = (counts[p] || 0) + tris.length;
    }
  }
  for (const [p, mesh] of parts) node.addChild(doc.createNode(p).setMesh(mesh));
  node.getMesh().dispose();
  node.setMesh(null);
}

for (const mat of root.listMaterials()) {
  const name = mat.getName();
  if (TRANSPARENT.test(name)) mat.setAlphaMode('BLEND').setDoubleSided(false);
  mat.setName(clean(name));
}
for (const tex of root.listTextures()) tex.setName(clean(tex.getName() || tex.getURI().split('/').pop()));

// livery and decals keep 4K so the logos stay sharp
await doc.transform(
  prune(),
  dedup(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', pattern: /paint|decal/, resize: [4096, 4096], quality: 88 }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', pattern: /^(?!.*(paint|decal)).+/, resize: [2048, 2048], quality: 88 }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);
await io.write(out, doc);
console.log(`${src} -> ${out}`, counts);
