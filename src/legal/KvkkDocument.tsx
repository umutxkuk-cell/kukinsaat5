import { createElement } from "react";
import { KVKK_REGISTRY, KVKK_SECTIONS, type LegalBlock } from "./kvkk";

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case "p":
      return <p>{block.text}</p>;

    case "ul":
      return (
        <ul className="lg-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );

    case "dl":
      return (
        <dl className="lg-dl">
          {block.items.map((item) => (
            <div key={item.k}>
              <dt>{item.k}</dt>
              <dd>{item.v}</dd>
            </div>
          ))}
        </dl>
      );

    case "lead":
      return (
        <>
          {block.items.map((item) => (
            <p key={item.k}>
              <strong>{item.k}:</strong> {item.v}
            </p>
          ))}
        </>
      );

    case "table":
      return (
        <div className="lg-table-wrap" tabIndex={0} role="region" aria-label="İşlenen kişisel veri kategorileri tablosu">
          <table className="lg-table">
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th key={index} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={index}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "purposes":
      return (
        <ol className="lg-purposes">
          {block.items.map((item, index) => (
            <li key={item.text}>
              <span className="lg-purposes__n">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{item.text}</p>
                <p className="lg-basis">
                  <span>Hukuki sebep:</span> {item.basis}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    default:
      return null;
  }
}

/* 17 bölümün tamamı. Sayfada h2, form içi pencerede h3 olarak kullanılır. */
export function KvkkSections({
  idPrefix = "kvkk",
  headingLevel = 2,
}: {
  idPrefix?: string;
  headingLevel?: 2 | 3;
}) {
  return (
    <>
      {KVKK_SECTIONS.map((section) => {
        const headingId = `${idPrefix}-${section.n}-baslik`;
        return (
          <section
            key={section.n}
            id={`${idPrefix}-${section.n}`}
            className="lg-section"
            data-lg-section={section.n}
            aria-labelledby={headingId}
          >
            <div className="lg-section__head">
              <span className="lg-section__n" aria-hidden="true">
                {section.n}
              </span>
              {createElement(`h${headingLevel}`, { id: headingId }, section.title)}
            </div>
            <div className="lg-section__body">
              {section.blocks.map((block, index) => (
                <Block key={`${section.n}-${index}`} block={block} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

export function KvkkRegistry() {
  const r = KVKK_REGISTRY;
  return (
    <aside className="lg-registry" aria-label={r.heading}>
      <span className="lg-registry__kicker">{r.heading}</span>
      <p className="lg-registry__name">{r.name}</p>
      <p className="lg-registry__address">{r.address}</p>

      <dl className="lg-registry__facts">
        {r.facts.map((fact) => (
          <div key={fact.k}>
            <dt>{fact.k}</dt>
            <dd>{fact.v}</dd>
          </div>
        ))}
      </dl>

      <ul className="lg-registry__contact">
        <li>
          <span>T</span>
          <a href={`tel:${r.phoneHref}`}>{r.phone}</a>
        </li>
        <li>
          <span>E</span>
          <a href={`mailto:${r.email}`}>{r.email}</a>
        </li>
        <li>
          <span>KEP</span>
          {r.kep}
        </li>
        <li>
          <span>Saat</span>
          {r.hours}
        </li>
      </ul>

      <p className="lg-registry__note">{r.note}</p>
    </aside>
  );
}
