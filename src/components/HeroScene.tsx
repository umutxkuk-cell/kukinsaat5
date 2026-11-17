import { Fragment, useEffect, useRef, useState } from "react";
import { HERO_ATLAS, HERO_FOCUS, HERO_LQIP, HERO_MAPS, HERO_STILL } from "../heroAssets";
import { HERO_LINES } from "../heroLines";
import "../hero.css";

/* Finished building, three acts — one photo, an embedded depth map and a set of vector lines
   extracted from the photo itself:
   1  the finished building, lit, with a slow dolly and real parallax
   2  a scan front climbs the facade; every structural line is drawn by hand-of-light as it passes
   3  warm light pours back down from the sky and the building returns, complete, wearing a faint
      gold trace of the engineering that stands behind it */

const T = { wipe0: 0.3, wipe1: 0.54, rebuild0: 0.64, rebuild1: 0.88 };

const sentences = [
  { text: "Dayanıklı yapı, doğru hesapla başlar.", from: 0.05, to: 0.33 },
  { text: "Proje ile saha aynı dili konuşmalı.", from: 0.325, to: 0.64 },
  { text: "İlk görüşmeden teslime, süreci birlikte yönetiriz.", from: 0.63, to: 1.03 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sm = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function decodeLines(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const view = new DataView(bytes.buffer);
  const count = view.getUint16(0, true);
  const data = new Float32Array(count * 6);
  let seed = 13;
  for (let i = 0; i < count; i++) {
    seed = (seed * 16807) % 2147483647;
    for (let k = 0; k < 4; k++) data[i * 6 + k] = view.getUint16(2 + i * 8 + k * 2, true) / 65535;
    data[i * 6 + 4] = bytes[2 + count * 8 + i] / 255;
    data[i * 6 + 5] = seed / 2147483647;
  }
  return { data, count };
}

const AT = HERO_ATLAS;
const f6 = (v: number) => v.toFixed(6);
const MAP_TEXEL = `vec2(${f6(1 / AT.mapW)}, ${f6(1 / AT.mapH)})`;
const MASK_TEXEL = `vec2(${f6(2 / AT.maskW)}, ${f6(2 / AT.maskH)})`;
const V_DEPTH = `${f6(1 - (AT.depthY + AT.mapH) / AT.h)} + uv.y * ${f6(AT.mapH / AT.h)}`;
const V_WARP = `${f6(1 - (AT.warpY + AT.mapH) / AT.h)} + uv.y * ${f6(AT.mapH / AT.h)}`;
const V_MASK = `${f6(1 - (AT.maskY + AT.maskH) / AT.h)} + uv.y * ${f6(AT.maskH / AT.h)}`;

const COMMON = `
uniform sampler2D uTex;
uniform sampler2D uMaps;
uniform vec4 uCam;
uniform vec2 uPivot;
float lum(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float depthAt(vec2 uv){ vec2 h = ${MAP_TEXEL}; uv = clamp(uv, h, 1.0 - h); return texture(uMaps, vec2(uv.x, ${V_DEPTH})).r; }
float warpAt(vec2 uv){ vec2 h = ${MAP_TEXEL}; uv = clamp(uv, h, 1.0 - h); return texture(uMaps, vec2(uv.x, ${V_WARP})).r; }
float skyAt(vec2 uv){ vec2 h = ${MASK_TEXEL}; uv = clamp(uv, h, 1.0 - h); return texture(uMaps, vec2(0.5 + uv.x * 0.5, ${V_MASK})).r; }
vec2 projA(vec2 uv, vec2 center, vec2 vis){ float wd = warpAt(uv); float k = 1.0 + uCam.z * (wd - uCam.w); vec2 t = uPivot + (uv - uPivot) * k + uCam.xy * (wd - uCam.w); return (t - center) / vis; }
`;

const QUAD_VS = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const QUAD_FS = `#version 300 es
precision highp float;
${COMMON}
uniform vec2 uRes, uVis, uCenter;
uniform vec3 uEdge;
uniform float uTime, uLit, uWipe, uRebuild, uBlur, uInk;
out vec4 outColor;

float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }

vec2 srcAt(vec2 t, float h){ float k = 1.0 + uCam.z * (h - uCam.w); return uPivot + (t - uCam.xy * (h - uCam.w) - uPivot) / k; }
vec3 march(vec2 t){
  float h = 1.0, ph = 1.0;
  vec2 s = srcAt(t, h);
  float d = warpAt(s);
  for (int i = 0; i < 20; i++) { if (d >= h) break; ph = h; h -= 0.05; s = srcAt(t, h); d = warpAt(s); }
  float a = h, b = ph;
  for (int i = 0; i < 4; i++) { float m = 0.5 * (a + b); if (warpAt(srcAt(t, m)) >= m) a = m; else b = m; }
  s = srcAt(t, a);
  return vec3(s, depthAt(s));
}
float Lm(vec2 uv){ return lum(textureLod(uTex, uv, uEdge.z).rgb); }
vec2 grad(vec2 uv){
  vec2 e = uEdge.xy;
  float tl = Lm(uv + e * vec2(-1.0, 1.0)), tc = Lm(uv + e * vec2(0.0, 1.0)), tr = Lm(uv + e * vec2(1.0, 1.0));
  float ml = Lm(uv + e * vec2(-1.0, 0.0)), mr = Lm(uv + e * vec2(1.0, 0.0));
  float bl = Lm(uv + e * vec2(-1.0, -1.0)), bc = Lm(uv + e * vec2(0.0, -1.0)), br = Lm(uv + e * vec2(1.0, -1.0));
  return vec2(-tl - 2.0 * ml - bl + tr + 2.0 * mr + br, -tl - 2.0 * tc - tr + bl + 2.0 * bc + br);
}
vec3 photo(vec3 c, float sky, float d, vec2 sc){
  float l = lum(c);
  vec3 toned = mix(vec3(0.03, 0.045, 0.06), vec3(1.0, 0.8, 0.58), smoothstep(0.02, 0.95, l));
  c = mix(c, toned * (0.35 + l * 0.9), 0.30);
  c = mix(c, c * c * (3.0 - 2.0 * c), 0.5);
  vec3 tint = mix(vec3(1.08, 0.86, 0.60), vec3(0.78, 0.74, 1.0), smoothstep(0.42, 1.0, sc.y));
  c = mix(c, c * tint, sky * 0.35);
  float dim = 1.0 - uLit;
  c *= 1.0 - dim * 0.55 * (1.0 - sky * 0.6);
  c = pow(c, vec3(mix(0.80, 0.90, dim))) * 1.08;
  c += vec3(0.10, 0.035, -0.03) * smoothstep(0.55, 1.0, l) * 0.5;
  c = mix(c, vec3(0.98, 0.74, 0.56), (1.0 - smoothstep(0.0, 0.55, d)) * (1.0 - sky) * 0.10 * uLit);
  return c;
}
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 sc = frag / uRes;
  vec3 hit = march(uCenter + (sc - 0.5) * uVis);
  vec2 uv = hit.xy;
  float d = hit.z;
  float sky = skyAt(uv);
  vec2 so = vec2(0.006, 0.009);
  float skyD = max(sky, max(max(skyAt(uv + vec2(so.x, 0.0)), skyAt(uv - vec2(so.x, 0.0))), max(skyAt(uv + vec2(0.0, so.y)), skyAt(uv - vec2(0.0, so.y)))));

  vec3 src = textureLod(uTex, uv, uBlur).rgb;
  vec3 soft = textureLod(uTex, uv, uBlur + 1.6).rgb;
  src = clamp(src + (src - soft) * 0.32, 0.0, 1.0);
  vec3 wrap = textureLod(uTex, uv, 5.5).rgb;
  float tw = 0.88 + 0.12 * sin(uTime * 1.7 + hash(floor(uv * vec2(210.0, 140.0))) * 6.283);
  vec3 bloom = max(textureLod(uTex, uv, 3.2).rgb - 0.22, 0.0);
  vec3 col = photo(src, sky, d, sc) + bloom * vec3(1.0, 0.74, 0.42) * 0.85 * tw * (1.0 - skyD) * uLit + wrap * wrap * vec3(1.0, 0.78, 0.56) * 0.14 * (1.0 - skyD * 0.8);
  vec3 colPhoto = col;
  float y = sc.y - (d - 0.5) * 0.09 + (noise(vec2(sc.x * 6.0, uTime * 0.3)) - 0.5) * 0.02;

  if (uWipe > 0.0005) {
    vec2 g = grad(uv);
    float m = length(g);
    vec2 n = g / max(m, 1e-5);
    float m1 = length(grad(uv + n * uEdge.xy)), m2 = length(grad(uv - n * uEdge.xy));
    float thin = smoothstep(-0.02, 0.02, m - max(m1, m2));
    float line = min(1.0, smoothstep(0.10, 0.36, m) * thin + smoothstep(0.14, 0.8, m) * 0.16) * (1.0 - sky);
    vec2 ed = 1.6 * ${MAP_TEXEL};
    float dm = length(vec2(depthAt(uv + vec2(ed.x, 0.0)) - depthAt(uv - vec2(ed.x, 0.0)), depthAt(uv + vec2(0.0, ed.y)) - depthAt(uv - vec2(0.0, ed.y))));
    float rim = smoothstep(0.05, 0.22, dm);
    vec3 lineCol = mix(vec3(0.34, 0.55, 0.64), vec3(0.94, 0.98, 1.0), smoothstep(0.05, 0.6, d));
    vec3 wire = vec3(0.006, 0.011, 0.013) + vec3(0.010, 0.024, 0.028) * d * (1.0 - sky) + src * 0.07 * (1.0 - sky);
    wire += lineCol * line * uInk * (1.25 + rim * 0.2) + vec3(0.16, 0.42, 0.5) * rim * 0.07;
    float hs = hash(floor(frag / 2.0));
    wire += vec3(0.7, 0.85, 1.0) * step(0.9972, hs) * (0.35 + 0.65 * sin(uTime * 1.4 + hs * 300.0)) * sky * 0.8;

    float s = mix(-0.14, 1.14, uWipe);
    float mk = 1.0 - smoothstep(s - 0.003, s + 0.003, y);
    float live = step(uWipe, 0.9995);
    float scan = (exp(-abs(y - s) * 120.0) + exp(-abs(y - s) * 18.0) * 0.2) * live;
    float trail = exp(-max(s - y, 0.0) * 9.0) * mk * live;
    float iso = 1.0 - smoothstep(0.0, 0.14, abs(fract(d * 22.0 - uTime * 0.12) - 0.5) * 2.0);
    wire += vec3(0.65, 0.51, 0.35) * iso * trail * 0.55 * (1.0 - sky);
    col = mix(col, wire, mk);
    col += vec3(0.85, 0.69, 0.48) * scan * 0.85;
    col += src * exp(-max(y - s, 0.0) * 9.0) * 0.16 * live * (1.0 - mk);
  }
  if (uRebuild > 0.0005) {
    float s2 = mix(1.14, -0.14, uRebuild);
    float rb = smoothstep(s2 - 0.004, s2 + 0.004, y);
    float live2 = step(uRebuild, 0.9995);
    float scan2 = (exp(-abs(y - s2) * 100.0) + exp(-abs(y - s2) * 13.0) * 0.26) * live2;
    float flood = exp(-max(y - s2, 0.0) * 5.0) * live2;
    col = mix(col, colPhoto + vec3(1.0, 0.72, 0.40) * flood * 0.16 * (1.0 - sky), rb);
    col += vec3(1.0, 0.80, 0.46) * scan2 * 0.9;
  }
  outColor = vec4(col, 1.0);
}`;

const LINE_VS = `#version 300 es
precision highp float;
${COMMON}
in vec2 aCorner;
in vec4 aSeg;
in vec2 aMeta;
uniform vec2 uVis, uCenter, uRes;
uniform float uK, uWipe, uWidth;
out float vSide;
out float vAlong;
out float vR;
out float vCapT;
out float vStr;
out float vSeed;
out float vLenPx;
out float vYadj;
out float vDepth;
out float vCore;
void main(){
  vec2 s0 = projA(aSeg.xy, uCenter, uVis);
  vec2 s1 = projA(aSeg.zw, uCenter, uVis);
  float d0 = depthAt(aSeg.xy), d1 = depthAt(aSeg.zw);
  float y0 = s0.y + 0.5 - (d0 - 0.5) * 0.09;
  float y1 = s1.y + 0.5 - (d1 - 0.5) * 0.09;
  bool flip = y1 < y0;
  float yl = flip ? y1 : y0;
  float yu = flip ? y0 : y1;
  float front = mix(-0.14, 1.14, uWipe);
  float r = clamp((front - yl) / max(0.07, yu - yl), 0.0, 1.0);
  vec2 p0 = s0 * uRes;
  vec2 p1 = s1 * uRes;
  vec2 dv = p1 - p0;
  float len = max(length(dv), 1.0);
  vec2 dir = dv / len;
  vec2 nrm = vec2(-dir.y, dir.x);
  float coreHalf = max(0.6, uWidth * uK * (0.55 + 0.75 * aMeta.x));
  float glowR = coreHalf * 4.5 + 2.0;
  float ext = glowR * 0.8;
  float e = aCorner.x * 2.0 - 1.0;
  vec2 pos = mix(p0, p1, aCorner.x) + dir * e * ext + nrm * aCorner.y * glowR;
  gl_Position = vec4(pos / (uRes * 0.5), 0.0, 1.0);
  float t = (aCorner.x * len + e * ext) / len;
  vAlong = flip ? 1.0 - t : t;
  vCapT = ext / len;
  vR = r;
  vSide = aCorner.y * glowR;
  vCore = coreHalf;
  vStr = aMeta.x;
  vSeed = aMeta.y;
  vLenPx = len;
  vYadj = pos.y / uRes.y + 0.5 - (mix(d0, d1, clamp(t, 0.0, 1.0)) - 0.5) * 0.09;
  vDepth = 0.5 * (d0 + d1);
}`;

const LINE_FS = `#version 300 es
precision highp float;
uniform float uTime, uRebuild, uK;
in float vSide;
in float vAlong;
in float vR;
in float vCapT;
in float vStr;
in float vSeed;
in float vLenPx;
in float vYadj;
in float vDepth;
in float vCore;
out vec4 outColor;
void main(){
  float lim = vR >= 0.999 ? 1.0 + vCapT : vR;
  if (vR <= 0.0005 || vAlong > lim) discard;
  float dpx = abs(vSide);
  float core = exp(-pow(dpx / vCore, 2.0) * 1.2);
  float halo = exp(-dpx / (vCore * 3.0)) * 0.22;
  float prof = core + halo;
  float behind = max(vR - vAlong, 0.0) * vLenPx;
  float drawing = step(vR, 0.999);
  float tip = exp(-behind / (16.0 * uK)) * drawing;
  float ph = vAlong * vLenPx * 0.0105 / uK - uTime * (0.9 + vSeed * 0.7) + vSeed * 17.0;
  float pulse = pow(0.5 + 0.5 * sin(ph * 6.2831), 18.0);
  float s2 = mix(1.14, -0.14, uRebuild);
  float passed = uRebuild > 0.0005 ? smoothstep(s2 - 0.012, s2 + 0.012, vYadj) : 0.0;
  prof = core + halo * mix(1.0, 0.3, passed);
  float flash = exp(-abs(vYadj - s2) * 32.0) * step(0.0005, uRebuild) * step(uRebuild, 0.9995);
  vec3 cool = mix(vec3(0.38, 0.62, 0.74), vec3(0.95, 0.99, 1.0), smoothstep(0.05, 0.65, vDepth));
  vec3 gold = vec3(1.0, 0.74, 0.42);
  vec3 col = mix(cool, gold, passed) + vec3(1.0, 0.86, 0.58) * (tip * 1.2 + flash * 0.8);
  float a = prof * (0.50 + 0.50 * vStr) * (1.0 + pulse * 1.6) * mix(1.0, 0.24, passed) + prof * (tip * 2.2 + flash * 1.6);
  outColor = vec4(col * a, a);
}`;

const NODE_VS = `#version 300 es
precision highp float;
${COMMON}
in vec4 aSeg;
in vec2 aMeta;
uniform vec2 uVis, uCenter;
uniform float uK, uWipe, uRebuild;
out float vA;
void main(){
  vec2 s0 = projA(aSeg.xy, uCenter, uVis);
  vec2 s1 = projA(aSeg.zw, uCenter, uVis);
  float y0 = s0.y + 0.5 - (depthAt(aSeg.xy) - 0.5) * 0.09;
  float y1 = s1.y + 0.5 - (depthAt(aSeg.zw) - 0.5) * 0.09;
  bool second = gl_VertexID == 1;
  vec2 sp = second ? s1 : s0;
  float yThis = second ? y1 : y0;
  bool isHigh = second ? (y1 >= y0) : (y0 > y1);
  float yl = min(y0, y1);
  float yu = max(y0, y1);
  float front = mix(-0.14, 1.14, uWipe);
  float r = clamp((front - yl) / max(0.07, yu - yl), 0.0, 1.0);
  float shown = isHigh ? step(0.999, r) : step(0.0005, r);
  float age = clamp((front - yThis) / 0.20, 0.0, 1.0);
  float flash = (1.0 - age) * (1.0 - age);
  float s2 = mix(1.14, -0.14, uRebuild);
  float passed = uRebuild > 0.0005 ? smoothstep(s2 - 0.012, s2 + 0.012, yThis) : 0.0;
  shown *= step(0.28, aMeta.x);
  vA = shown * (0.30 + 0.9 * flash) * (1.0 - passed);
  gl_PointSize = (2.6 + 6.0 * flash) * uK * (0.7 + 0.6 * aMeta.x);
  gl_Position = shown > 0.5 ? vec4(sp * 2.0, 0.0, 1.0) : vec4(3.0, 3.0, 0.0, 1.0);
}`;

const NODE_FS = `#version 300 es
precision highp float;
in float vA;
out vec4 outColor;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vA;
  outColor = vec4(vec3(0.85, 0.96, 1.0) * a, a);
}`;

export default function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);

  const lineRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [isStatic] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const holder = canvas.parentElement as HTMLElement;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let cancelled = false;

    /* ---------- WebGL ---------- */
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    let glOk = false;
    let lineOk = false;
    let quad: WebGLProgram | null = null;
    let lineProg: WebGLProgram | null = null;
    let nodeProg: WebGLProgram | null = null;
    let quadVao: WebGLVertexArrayObject | null = null;
    let lineVao: WebGLVertexArrayObject | null = null;
    let nodeVao: WebGLVertexArrayObject | null = null;
    let colorTex: WebGLTexture | null = null;
    let texW = 640, texH = 360;
    let quality = 1;
    const strokes = decodeLines(HERO_LINES);
    const locs = new Map<WebGLProgram, Map<string, WebGLUniformLocation | null>>();
    const U = (program: WebGLProgram, name: string) => {
      let m = locs.get(program);
      if (!m) { m = new Map(); locs.set(program, m); }
      if (!m.has(name)) m.set(name, (gl as WebGL2RenderingContext).getUniformLocation(program, name));
      return m.get(name) as WebGLUniformLocation | null;
    };

    if (gl) {
      const build = (label: string, vs: string, fs: string) => {
        const program = gl.createProgram() as WebGLProgram;
        for (const [type, source] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
          const shader = gl.createShader(type) as WebGLShader;
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.warn(`[hero:${label}] shader`, gl.getShaderInfoLog(shader));
          gl.attachShader(program, shader);
        }
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.warn(`[hero:${label}] link`, gl.getProgramInfoLog(program)); return null; }
        return program;
      };
      quad = build("quad", QUAD_VS, QUAD_FS);
      lineProg = build("line", LINE_VS, LINE_FS);
      nodeProg = build("node", NODE_VS, NODE_FS);
      if (quad) {
        glOk = true;
        quadVao = gl.createVertexArray();
        gl.bindVertexArray(quadVao);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(quad, "aPos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        if (lineProg && nodeProg) {
          lineOk = true;
          const instances = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, instances);
          gl.bufferData(gl.ARRAY_BUFFER, strokes.data, gl.STATIC_DRAW);
          const corners = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, corners);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -1, 0, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

          lineVao = gl.createVertexArray();
          gl.bindVertexArray(lineVao);
          gl.bindBuffer(gl.ARRAY_BUFFER, corners);
          const aCorner = gl.getAttribLocation(lineProg, "aCorner");
          gl.enableVertexAttribArray(aCorner);
          gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, instances);
          const lSeg = gl.getAttribLocation(lineProg, "aSeg"), lMeta = gl.getAttribLocation(lineProg, "aMeta");
          gl.enableVertexAttribArray(lSeg);
          gl.vertexAttribPointer(lSeg, 4, gl.FLOAT, false, 24, 0);
          gl.vertexAttribDivisor(lSeg, 1);
          gl.enableVertexAttribArray(lMeta);
          gl.vertexAttribPointer(lMeta, 2, gl.FLOAT, false, 24, 16);
          gl.vertexAttribDivisor(lMeta, 1);

          nodeVao = gl.createVertexArray();
          gl.bindVertexArray(nodeVao);
          gl.bindBuffer(gl.ARRAY_BUFFER, instances);
          const nSeg = gl.getAttribLocation(nodeProg, "aSeg"), nMeta = gl.getAttribLocation(nodeProg, "aMeta");
          gl.enableVertexAttribArray(nSeg);
          gl.vertexAttribPointer(nSeg, 4, gl.FLOAT, false, 24, 0);
          gl.vertexAttribDivisor(nSeg, 1);
          gl.enableVertexAttribArray(nMeta);
          gl.vertexAttribPointer(nMeta, 2, gl.FLOAT, false, 24, 16);
          gl.vertexAttribDivisor(nMeta, 1);
        }
        gl.bindVertexArray(null);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      }
    }
    if (!glOk) setFallback(true);

    const upload = (unit: number, img: HTMLImageElement, mips: boolean, existing: WebGLTexture | null) => {
      const g = gl as WebGL2RenderingContext;
      const tex = existing ?? g.createTexture();
      g.activeTexture(g.TEXTURE0 + unit);
      g.bindTexture(g.TEXTURE_2D, tex);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, img);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, mips ? g.LINEAR_MIPMAP_LINEAR : g.LINEAR);
      if (mips) g.generateMipmap(g.TEXTURE_2D);
      return tex;
    };

    const resize = () => {
      if (!gl || !glOk) return;
      const w = Math.max(1, holder.clientWidth), h = Math.max(1, holder.clientHeight);
      const pr = Math.max(0.5, Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(2.6e6 / (w * h))) * quality);
      canvas.width = Math.round(w * pr);
      canvas.height = Math.round(h * pr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    /* ---------- assets: embedded maps + preview first, then the full frame from the CDN ---------- */
    let mapsReady = false, colorReady = false;
    let fallbackSrc = "";
    let focusPull = 0;
    const loadImage = (src: string, cors: boolean) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        if (cors) img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    const maxTex = gl && glOk ? (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) : 2048;
    const width = maxTex < 4096 ? 1920 : coarse ? 2560 : 3840;
    const fullUrl = `${HERO_STILL}?auto=compress&cs=tinysrgb&w=${width}`;
    const setLoad = (_text: string, _done: boolean) => undefined;
    (async () => {
      setLoad("SAHNE YÜKLENİYOR", false);
      const [maps, preview] = await Promise.all([loadImage(HERO_MAPS, false), loadImage(HERO_LQIP, false)]);
      if (cancelled) return;
      if (gl && glOk && maps && preview) {
        upload(1, maps, false, null);
        colorTex = upload(0, preview, true, null);
        texW = preview.naturalWidth;
        texH = preview.naturalHeight;
        mapsReady = colorReady = true;
      } else {
        fallbackSrc = HERO_LQIP;
        colorReady = true;
      }
      const full = await loadImage(fullUrl, Boolean(gl && glOk));
      if (cancelled) return;
      if (full) {
        if (gl && glOk && mapsReady) {
          upload(0, full, true, colorTex);
          texW = full.naturalWidth;
          texH = full.naturalHeight;
          focusPull = 1;
        } else fallbackSrc = fullUrl;
      }
      setLoad(full ? "SAHNE HAZIR" : "ÖNİZLEME", true);
    })();

    /* ---------- text ---------- */
    const chars = lineRefs.current.map((el) => (el ? Array.from(el.querySelectorAll<HTMLElement>(".kt-ch")) : []));
    const lineState = sentences.map(() => -1);
    const applyText = (p: number) => {
      chars.forEach((list, s) => {
        const { from, to } = sentences[s];
        const u = (p - from) / (to - from);
        if (u < -0.02 || u > 1.04) {
          if (lineState[s] !== 0) {
            list.forEach((c) => { c.style.opacity = "0"; });
            lineState[s] = 0;
          }
          return;
        }
        lineState[s] = 1;
        const n = list.length;
        for (let i = 0; i < n; i++) {
          const a = (i / (n - 1)) * 0.66;
          const vin = sm(a, a + 0.05, u);
          const o = vin * (1 - sm(a + 0.24, a + 0.32, u));
          const el = list[i];
          el.style.opacity = o < 0.004 ? "0" : o.toFixed(3);
          el.style.transform = vin < 0.999 ? `translate3d(0,${((1 - vin) * 0.22).toFixed(3)}em,0)` : "";
        }
      });
    };

    /* ---------- loop ---------- */
    let target = isStatic ? 0.24 : 0;
    let current = target;
    let raf = 0;
    let last = performance.now();
    let t0 = -1;
    let visible = true;
    let covers = true;
    let first = true;
    let tone = "";
    let frames = 0, slow = 0, drops = 0;
    let ptx = 0, pty = 0, px = 0, py = 0;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      covers = rect.bottom > 96 && rect.top < 96;
      if (!isStatic) target = clamp01(-rect.top / Math.max(1, section.offsetHeight - window.innerHeight));
    };

    const draw = (p: number, time: number) => {
      const g = gl as WebGL2RenderingContext;
      const w = canvas.width, h = canvas.height;
      const portrait = w / h < 0.8;
      const intro = isStatic ? 0 : 1 - sm(0, 2.6, time - t0);
      const act2 = clamp01((p - T.wipe0) / (T.wipe1 - T.wipe0));
      const act3 = clamp01((p - T.rebuild0) / (T.rebuild1 - T.rebuild0));
      const push = sm(0, 0.62, p);
      const pull = sm(0.66, 1, p);
      const zoom = 1.03 + 0.1 * push - 0.075 * pull + intro * 0.05;
      const ra = w / h, ta = texW / texH;
      const vx = (ra > ta ? 1 : ra / ta) / zoom, vy = (ra > ta ? ta / ra : 1) / zoom;
      const fx = portrait ? lerp(HERO_FOCUS.x - 0.2, HERO_FOCUS.x, sm(0.04, 0.55, p)) : lerp(0.5, HERO_FOCUS.x, push * 0.5);
      const cx = Math.min(1 - vx / 2, Math.max(vx / 2, fx));
      const cy = Math.min(1 - vy / 2, Math.max(vy / 2, 0.5 + (HERO_FOCUS.y - 0.5) * 0.4));
      const camX = lerp(-0.018, 0.022, push) - 0.034 * pull + px * 0.009 + Math.sin(time * 0.23) * 0.0012;
      const camY = lerp(0.004, -0.004, p) - py * 0.006;
      const camZ = lerp(0.03, 0.3, push) - 0.24 * pull;
      const texelsPerPx = (vx * texW) / w;
      const edgeX = Math.max(vx / w, 1 / texW), edgeY = Math.max(vy / h, 1 / texH);
      const blur = focusPull * 3.4;
      const K = h / 900;

      const common = (program: WebGLProgram) => {
        g.useProgram(program);
        g.uniform1i(U(program, "uTex"), 0);
        g.uniform1i(U(program, "uMaps"), 1);
        g.uniform4f(U(program, "uCam"), camX, camY, camZ, 0.56);
        g.uniform2f(U(program, "uPivot"), HERO_FOCUS.x, HERO_FOCUS.y);
        g.uniform2f(U(program, "uVis"), vx, vy);
        g.uniform2f(U(program, "uCenter"), cx, cy);
        g.uniform2f(U(program, "uRes"), w, h);
        g.uniform1f(U(program, "uTime"), isStatic ? 0 : time);
        g.uniform1f(U(program, "uK"), K);
        g.uniform1f(U(program, "uWipe"), act2);
        g.uniform1f(U(program, "uRebuild"), act3);
      };
      const q = quad as WebGLProgram;
      common(q);
      g.uniform3f(U(q, "uEdge"), edgeX, edgeY, Math.max(0, Math.log2(Math.max(1, texelsPerPx))));
      g.uniform1f(U(q, "uLit"), 0.5 + 0.5 * sm(0, 0.2, p));
      g.uniform1f(U(q, "uBlur"), blur);
      g.uniform1f(U(q, "uInk"), lineOk ? 0.38 : 1);
      g.disable(g.BLEND);
      g.bindVertexArray(quadVao);
      g.drawArrays(g.TRIANGLES, 0, 3);

      if (lineOk && act2 > 0.0005) {
        g.enable(g.BLEND);
        g.blendFunc(g.ONE, g.ONE);
        const lp = lineProg as WebGLProgram;
        common(lp);
        g.uniform1f(U(lp, "uWidth"), 1.1);
        g.bindVertexArray(lineVao);
        g.drawArraysInstanced(g.TRIANGLE_STRIP, 0, 4, strokes.count);
        const np = nodeProg as WebGLProgram;
        common(np);
        g.bindVertexArray(nodeVao);
        g.drawArraysInstanced(g.POINTS, 0, 2, strokes.count);
        g.disable(g.BLEND);
      }
      g.bindVertexArray(null);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const raw = (now - last) / 1000;
      last = now;
      const nextTone = !covers ? "" : current > 0.4 && current < 0.72 ? "dark" : "sun";
      if (nextTone !== tone) {
        tone = nextTone;
        if (tone) document.documentElement.dataset.heroTone = tone;
        else delete document.documentElement.dataset.heroTone;
      }
      if (!visible) return;
      const kd = 1 - Math.exp(-Math.min(Math.max(raw, 0), 0.3) * 7);
      current += (target - current) * kd;
      if (Math.abs(target - current) < 0.0002) current = target;
      if (!isStatic) {
        px += (ptx - px) * kd * 0.45;
        py += (pty - py) * kd * 0.45;
      }
      if (focusPull > 0) focusPull = Math.max(0, focusPull - Math.min(Math.max(raw, 0), 0.05) / 0.9);
      if (gl && glOk && mapsReady) {
        const time = now / 1000;
        if (t0 < 0) t0 = time;
        draw(current, time);
        frames++;
        if (frames > 8 && drops < 2) {
          slow += Math.min(Math.max(raw, 0), 0.05);
          if (frames === 32) {
            if (slow / 24 > 0.031) {
              quality *= 0.75;
              drops++;
              resize();
            }
            frames = 8;
            slow = 0;
          }
        }
      }
      if (fallbackSrc && stillRef.current && stillRef.current.getAttribute("src") !== fallbackSrc) stillRef.current.src = fallbackSrc;
      if (first && colorReady) {
        first = false;
        setReady(true);
      }
      if (isStatic) {
        if (lineState[0] !== 2) {
          chars.forEach((list) => list.forEach((c) => { c.style.opacity = "1"; }));
          lineState[0] = 2;
        }
      } else {
        applyText(current);
      }
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      ptx = (event.clientX / window.innerWidth - 0.5) * 2;
      pty = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      resize();
      measure();
    };
    const observer = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { rootMargin: "120px" });
    observer.observe(section);

    measure();
    current = target;
    raf = requestAnimationFrame(frame);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      delete document.documentElement.dataset.heroTone;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [isStatic]);

  return (
    <section className={`kt-hero${ready ? " is-ready" : ""}${isStatic ? " is-static" : ""}${fallback ? " is-fallback" : ""}`} id="top" ref={sectionRef} aria-label="Bitmiş yapıdan mühendislik çizimine ve geri">
      <div className="kt-hero-sticky">
        {fallback && <img className="kt-hero-fallback" ref={stillRef} alt="Gün batımında koyu cam cepheli, pencereleri ışıklı ve çelik taşıyıcı kafesi görünen modern bir yapının alttan görünümü" />}
        <canvas ref={canvasRef} className="kt-hero-canvas" role="img" aria-label="Gün batımında modern bir yapının ışıklı cephesi; kaydırdıkça cephenin strüktürel çizgileri çizilir ve yapı yeniden tamamlanır" />
        <div className="kt-hero-vignette" aria-hidden="true" />
        <div className="kt-hero-grain" aria-hidden="true" />
        <h1 className="sr-only">KUK İnşaat | Kocaeli'de inşaat uygulaması ve mühendislik hizmetleri</h1>
        <div className="kt-hero-text">
          {sentences.map((sentence, si) => (
            <h2 className="kt-line" key={sentence.text} aria-label={sentence.text} ref={(el) => { lineRefs.current[si] = el; }}>
              {sentence.text.split(" ").map((word, wi) => (
                <Fragment key={wi}>
                  <span className="kt-word" aria-hidden="true">
                    {Array.from(word).map((ch, ci) => <span className="kt-ch" key={ci}>{ch}</span>)}
                  </span>{" "}
                </Fragment>
              ))}
            </h2>
          ))}
        </div>

      </div>
    </section>
  );
}
