import type { CSSProperties } from "react";

/* Tonlu aksonometrik kütle modelleri — Projelerimiz sayfasındaki üç çalışma alanı.
   Fotoğraf ya da render değildir: bir yapı türünü anlatan, ölçeksiz şematik modeldir ve
   öyle etiketlenir; gerçek bir projeyi, konumu ya da tamamlanmış bir yapıyı temsil etmez.
   Yüzeyler üç tonla (üst / ön / yan) boyanır; pencereler sayfa göründüğünde sırayla aydınlanır. */

const C30 = Math.cos(Math.PI / 6);
const OX = 193;
const OY = 124;

type P3 = [number, number, number];

const xy = ([x, y, z]: P3): [number, number] => [OX + (x - y) * C30, OY + (x + y) * 0.5 - z];
const pts = (list: P3[]) =>
  list
    .map((p) => {
      const [sx, sy] = xy(p);
      return `${sx.toFixed(1)},${sy.toFixed(1)}`;
    })
    .join(" ");

/* Kutu: üst, yan (x = x + w) ve ön (y = y + d) yüzleri görünür. */
function Box({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  tone = "",
}: {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  tone?: string;
}) {
  return (
    <g className={tone}>
      <polygon
        className="ax-side"
        points={pts([
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ])}
      />
      <polygon
        className="ax-front"
        points={pts([
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
      />
      <polygon
        className="ax-top"
        points={pts([
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
      />
    </g>
  );
}

/* Zemin üzerindeki düz yüzey (havuz, döşeme, gölge) */
function Flat({ z = 0, x0, x1, y0, y1, cls }: { z?: number; x0: number; x1: number; y0: number; y1: number; cls: string }) {
  return (
    <polygon
      className={cls}
      points={pts([
        [x0, y0, z],
        [x1, y0, z],
        [x1, y1, z],
        [x0, y1, z],
      ])}
    />
  );
}

/* Pencerelerin yaklaşık %40'ı sayfa göründüğünde aydınlanır; sıra numarası gecikmeyi belirler. */
const lights = (seed: number) => (seed * 7 + 3) % 5 < 2;
const delay = (seed: number) => ({ "--d": seed % 9 }) as CSSProperties;

/* Ön yüzde (y sabit) yan yana pencereler */
function FrontRow({
  y,
  x,
  count,
  w,
  gap,
  z0,
  z1,
  seed,
  allLit = false,
}: {
  y: number;
  x: number;
  count: number;
  w: number;
  gap: number;
  z0: number;
  z1: number;
  seed: number;
  allLit?: boolean;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x0 = x + i * (w + gap);
        const s = seed + i;
        return (
          <polygon
            key={i}
            className={`ax-win${allLit || lights(s) ? " ax-win--lit" : ""}`}
            style={delay(s)}
            points={pts([
              [x0, y, z0],
              [x0 + w, y, z0],
              [x0 + w, y, z1],
              [x0, y, z1],
            ])}
          />
        );
      })}
    </>
  );
}

/* Yan yüzde (x sabit) yan yana pencereler */
function SideRow({
  x,
  y,
  count,
  w,
  gap,
  z0,
  z1,
  seed,
}: {
  x: number;
  y: number;
  count: number;
  w: number;
  gap: number;
  z0: number;
  z1: number;
  seed: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const y0 = y + i * (w + gap);
        const s = seed + i * 2 + 1;
        return (
          <polygon
            key={i}
            className={`ax-win ax-win--side${lights(s) ? " ax-win--lit" : ""}`}
            style={delay(s)}
            points={pts([
              [x, y0, z0],
              [x, y0 + w, z0],
              [x, y0 + w, z1],
              [x, y0, z1],
            ])}
          />
        );
      })}
    </>
  );
}

function Tree({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  const [bx, by] = xy([x, y, 0]);
  const [cx, cy] = xy([x, y, r + 11]);
  return (
    <g>
      <ellipse className="ax-shadow" cx={bx + 7} cy={by + 1} rx={r * 0.85} ry={r * 0.36} />
      <line className="ax-trunk" x1={bx} y1={by} x2={cx} y2={cy} />
      <circle className="ax-tree" cx={cx} cy={cy} r={r} />
      <circle className="ax-tree-hi" cx={cx - r * 0.26} cy={cy - r * 0.3} r={r * 0.5} />
    </g>
  );
}

function Plate() {
  return <Box x={0} y={0} z={-6} w={220} d={180} h={6} tone="ax-ground" />;
}

/* Konut — konsollu iki kütle, teras, havuz */
function Konut() {
  return (
    <>
      <Plate />
      <Flat x0={56} x1={216} y0={10} y1={102} cls="ax-shadow" />
      <Flat x0={22} x1={108} y0={122} y1={166} cls="ax-water" />
      <Flat x0={118} x1={150} y0={110} y1={180} cls="ax-pave" />
      <Tree x={18} y={34} r={12} />

      <Box x={40} y={28} w={132} d={82} h={34} />
      <FrontRow y={110} x={52} count={3} w={32} gap={5} z0={5} z1={29} seed={1} />
      <SideRow x={172} y={40} count={2} w={26} gap={6} z0={5} z1={29} seed={4} />

      <Box x={72} y={18} z={34} w={128} d={72} h={30} />
      <FrontRow y={90} x={84} count={3} w={30} gap={7} z0={43} z1={57} seed={2} />
      <SideRow x={200} y={28} count={2} w={23} gap={6} z0={43} z1={57} seed={7} />

      <Box x={68} y={14} z={64} w={136} d={80} h={3} tone="ax-cap" />
      <Box x={150} y={30} z={67} w={18} d={18} h={7} />

      <Tree x={198} y={152} />
      <Tree x={14} y={170} r={11} />
    </>
  );
}

/* Ticari — ızgara cepheli altı katlı blok, giriş saçağı, çatı hacmi */
function Ticari() {
  const floors = [1, 2, 3, 4, 5];
  return (
    <>
      <Plate />
      <Flat x0={60} x1={188} y0={22} y1={114} cls="ax-shadow" />
      {[0, 1, 2, 3, 4].map((k) => (
        <polyline key={k} className="ax-mark" points={pts([[22 + k * 17, 150, 0], [22 + k * 17, 176, 0]])} />
      ))}
      <Tree x={18} y={38} r={12} />

      <Box x={44} y={30} w={128} d={92} h={120} />
      <FrontRow y={122} x={52} count={2} w={40} gap={32} z0={4} z1={16} seed={3} allLit />
      <polygon
        className="ax-door"
        points={pts([
          [96, 122, 0],
          [120, 122, 0],
          [120, 122, 15],
          [96, 122, 15],
        ])}
      />
      {floors.map((f) => (
        <FrontRow key={`f${f}`} y={122} x={52} count={4} w={25} gap={4} z0={f * 20 + 5} z1={f * 20 + 15} seed={f * 4} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((f) => (
        <SideRow key={`s${f}`} x={172} y={38} count={3} w={22} gap={4} z0={f * 20 + 5} z1={f * 20 + 15} seed={f * 3 + 2} />
      ))}

      <Box x={86} y={122} z={17} w={44} d={14} h={2.5} tone="ax-cap" />
      <Box x={42} y={28} z={120} w={132} d={96} h={3} tone="ax-cap" />
      <Box x={84} y={58} z={123} w={48} d={34} h={10} />

      <Tree x={200} y={160} />
      <Tree x={206} y={98} r={11} />
      <Tree x={12} y={168} r={11} />
    </>
  );
}

/* Karma — aydınlık ticari taban üzerinde balkonlu konut kütlesi */
function Karma() {
  const floors = [0, 1, 2, 3, 4, 5, 6];
  const base = 32.5;
  return (
    <>
      <Plate />
      <Flat x0={34} x1={220} y0={14} y1={142} cls="ax-shadow" />

      <Box x={18} y={22} w={186} d={128} h={30} />
      <FrontRow y={150} x={26} count={6} w={24} gap={6} z0={4} z1={22} seed={5} allLit />
      <SideRow x={204} y={30} count={4} w={24} gap={5} z0={4} z1={22} seed={6} />
      <Box x={16} y={20} z={30} w={190} d={132} h={2.5} tone="ax-cap" />

      <Box x={62} y={42} z={base} w={100} d={82} h={112} />
      {floors.map((f) => (
        <FrontRow key={`f${f}`} y={124} x={70} count={3} w={24} gap={6} z0={base + f * 16 + 4.5} z1={base + f * 16 + 13} seed={f * 5 + 1} />
      ))}
      {floors.map((f) => (
        <SideRow key={`s${f}`} x={162} y={50} count={2} w={30} gap={6} z0={base + f * 16 + 4.5} z1={base + f * 16 + 13} seed={f * 3} />
      ))}
      {floors.slice(1).map((f) => (
        <Box key={`b${f}`} x={98} y={124} z={base + f * 16} w={32} d={7} h={1.6} tone="ax-cap" />
      ))}

      <Box x={60} y={40} z={base + 112} w={104} d={86} h={3} tone="ax-cap" />
      <Box x={84} y={60} z={base + 115} w={56} d={44} h={8} />

      <Tree x={210} y={168} r={11} />
      <Tree x={6} y={166} r={11} />
    </>
  );
}

export type ModelKind = "konut" | "ticari" | "karma";

const LABELS: Record<ModelKind, string> = {
  konut: "Konut yapısı — ölçeksiz şematik kütle modeli",
  ticari: "Ticari yapı — ölçeksiz şematik kütle modeli",
  karma: "Karma kullanımlı yapı — ölçeksiz şematik kütle modeli",
};

export function MassModel({ kind }: { kind: ModelKind }) {
  return (
    <svg className="ax" viewBox="30 26 360 310" role="img" aria-label={LABELS[kind]}>
      {kind === "konut" && <Konut />}
      {kind === "ticari" && <Ticari />}
      {kind === "karma" && <Karma />}
    </svg>
  );
}
