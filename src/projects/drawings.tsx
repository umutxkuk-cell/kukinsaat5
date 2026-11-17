/* Şematik vaziyet planı — ana sayfadaki portföy bölümünde kullanılır.
   Bir çalışma alanını (yapı türünü) anlatır; gerçek bir projeyi, konumu ya da tamamlanmış
   bir yapıyı temsil etmez. Projelerimiz sayfasındaki tonlu kütle modellerinden (models.tsx)
   bilerek farklı bir çizim türüdür; aynı görsel iki yerde tekrar etmez. */

export function SitePlan({ dark = false }: { dark?: boolean }) {
  const plots = [70, 470, 870];
  return (
    <svg
      className={`pj-elev pj-elev--plan${dark ? " pj-elev--dark" : ""}`}
      viewBox="0 0 1240 330"
      fill="none"
      role="img"
      aria-label="Konut, ticari ve karma kullanımlı yapı türlerini gösteren ölçeksiz şematik vaziyet planı"
    >
      {/* Yol */}
      <g className="pj-elev__main">
        <line x1="20" y1="262" x2="1220" y2="262" />
        <line x1="20" y1="308" x2="1220" y2="308" />
      </g>
      <g className="pj-elev__sub pj-dash">
        <line x1="20" y1="285" x2="1220" y2="285" />
        {plots.map((x) => (
          <rect key={x} x={x} y="40" width="300" height="196" />
        ))}
      </g>

      {/* Konut — L planlı kütle, teras ve havuz */}
      <g className="pj-elev__main">
        <path d="M110 70H270V132H212V196H110Z" />
        <rect x="236" y="152" width="100" height="52" />
        <circle cx="336" cy="78" r="15" />
        <circle cx="92" cy="218" r="10" />
        <circle cx="352" cy="222" r="8" />
      </g>
      <g className="pj-elev__sub">
        <line x1="110" y1="132" x2="212" y2="132" />
        <line x1="170" y1="70" x2="170" y2="196" />
        <line x1="212" y1="70" x2="212" y2="132" />
        <line x1="246" y1="165" x2="326" y2="165" />
        <line x1="246" y1="178" x2="326" y2="178" />
        <line x1="246" y1="191" x2="326" y2="191" />
      </g>

      {/* Ticari — aks ızgarası, çekirdek ve giriş saçağı */}
      <g className="pj-elev__main">
        <rect x="510" y="70" width="220" height="130" />
        <rect x="600" y="115" width="40" height="40" />
        <rect x="592" y="200" width="56" height="12" />
        <circle cx="488" cy="222" r="9" />
        <circle cx="752" cy="222" r="9" />
        <circle cx="750" cy="62" r="12" />
      </g>
      <g className="pj-elev__sub">
        {[554, 598, 642, 686].map((x) => (
          <line key={x} x1={x} y1="70" x2={x} y2="200" />
        ))}
        <line x1="510" y1="113" x2="730" y2="113" />
        <line x1="510" y1="157" x2="730" y2="157" />
        <path d="M600 115L640 155M640 115L600 155" />
      </g>

      {/* Karma — ticari taban, üzerinde konut kütlesi ve çekirdek */}
      <g className="pj-elev__main">
        <rect x="895" y="62" width="250" height="146" />
        <rect x="950" y="88" width="140" height="92" />
        <rect x="1005" y="119" width="30" height="30" />
        <circle cx="1160" cy="224" r="9" />
        <circle cx="882" cy="224" r="9" />
      </g>
      <g className="pj-elev__sub">
        <rect x="957" y="95" width="126" height="78" />
        {[945, 995, 1045, 1095].map((x) => (
          <line key={x} x1={x} y1="180" x2={x} y2="208" />
        ))}
        <path d="M1005 119L1035 149M1035 119L1005 149" />
      </g>

      {/* Ölçü çizgileri ve kuzey oku */}
      <g className="pj-elev__accent">
        {plots.map((x) => (
          <path key={x} d={`M${x} 22H${x + 300}M${x} 16V28M${x + 300} 16V28`} />
        ))}
        <path d="M48 40V236M42 40H54M42 236H54" />
        <path d="M1206 98V46M1198 58L1206 46L1214 58" />
        <circle cx="1206" cy="72" r="22" />
      </g>
    </svg>
  );
}
