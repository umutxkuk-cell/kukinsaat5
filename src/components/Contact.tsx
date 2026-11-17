import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useHref } from "react-router";
import emailjs, { EmailJSResponseStatus } from "../utils/emailjsClient";
import { AlertCircle, ArrowRight, Check, Loader2, Mail, Phone } from "lucide-react";
import { COMPANY } from "../company";
import { EMAILJS_CONFIG } from "../config/emailjs";
import { services } from "../services";
import KvkkDialog from "../legal/KvkkDialog";
import { SigEyebrow, SigWords } from "../signature/motion";

type FormStatus = "idle" | "sending" | "sent" | "error";

type FieldKey = "name" | "email" | "phone" | "subject" | "message" | "kvkk";
type FieldErrors = Partial<Record<FieldKey, string>>;

const SUBJECT_OPTIONS = [
  ...services.map((service) => service.title),
  "Konut Yapısı Projesi",
  "Ticari / Karma Kullanımlı Yapı",
  "Genel Görüşme ve Bilgi Talebi",
] as const;

const QUICK_TOPICS: { label: string; value: string }[] = [
  { label: "Yapı Uygulaması", value: services[0].title },
  { label: "Mühendislik", value: services[1].title },
  { label: "Teknik Koordinasyon", value: services[2].title },
  { label: "Süreç Yönetimi", value: services[3].title },
  { label: "Teknik Danışmanlık", value: services[4].title },
  { label: "Genel Görüşme", value: "Genel Görüşme ve Bilgi Talebi" },
];

const PREP_NOTES = [
  {
    n: "01",
    title: "Konum ve arsa bilgisi",
    text: "İlçe, mahalle veya varsa ada-parsel bilgisi.",
  },
  {
    n: "02",
    title: "Yapı türü ve yaklaşık ölçek",
    text: "Konut, ticari veya karma kullanım amacı ve öngörülen büyüklük.",
  },
  {
    n: "03",
    title: "Mevcut aşama",
    text: "Fikir aşaması, hazır proje veya devam eden uygulama durumu.",
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[0-9+\s().-]{7,24}$/;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECT_OPTIONS[0]);
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [sentRecipientName, setSentRecipientName] = useState("");

  const inFlightRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Aydınlatma metni form sayfasından ayrılmadan, pencere içinde okunur. */
  const [kvkkOpen, setKvkkOpen] = useState(false);
  const closeKvkk = useCallback(() => setKvkkOpen(false), []);
  const kvkkHref = useHref("/kvkk");

  useEffect(() => {
    if (EMAILJS_CONFIG.publicKey) {
      emailjs.init({
        publicKey: EMAILJS_CONFIG.publicKey,
        limitRate: {
          id: "kuk-contact-form",
          throttle: 15000,
        },
      });
    }
  }, []);

  const clearFieldError = (key: FieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateFields = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (name.trim().length < 2) {
      errors.name = "Lütfen adınızı ve soyadınızı girin.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Lütfen geçerli bir e-posta adresi girin (ör. ad@ornek.com).";
    }
    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) {
      errors.phone = "Lütfen geçerli bir telefon numarası girin.";
    }
    if (!subject.trim()) {
      errors.subject = "Lütfen bir konu veya hizmet seçin.";
    }
    if (message.trim().length < 10) {
      errors.message = "Lütfen talebinizi kısaca açıklayın (en az 10 karakter).";
    }
    if (!kvkk) {
      errors.kvkk = "Mesajınızı iletebilmemiz için KVKK aydınlatma onayını işaretleyin.";
    }
    return errors;
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSubject(SUBJECT_OPTIONS[0]);
    setLocation("");
    setMessage("");
    setKvkk(false);
    setHoneypot("");
    setFieldErrors({});
    setErrorMessage("");
  };

  const buildFallbackMailto = () => {
    const cleanSubject = `Teklif / Bilgi Talebi — ${subject || "Genel"}`;
    const lines = [
      `Ad Soyad : ${name.trim() || "-"}`,
      `E-posta  : ${email.trim() || "-"}`,
      `Telefon  : ${phone.trim() || "-"}`,
      `Konu     : ${subject || "-"}`,
      ...(location.trim() ? [`Konum    : ${location.trim()}`] : []),
      "",
      "Mesaj:",
      message.trim(),
    ];
    return `mailto:${EMAILJS_CONFIG.toEmail}?subject=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlightRef.current || status === "sending") return;

    if (honeypot.trim() !== "") {
      return;
    }

    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0] as FieldKey;
      document.getElementById(`contact-field-${firstKey}`)?.focus();
      return;
    }

    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      console.error("[KUK Contact / EmailJS] Eksik yapılandırma:", {
        hasServiceId: Boolean(EMAILJS_CONFIG.serviceId),
        hasTemplateId: Boolean(EMAILJS_CONFIG.templateId),
        hasPublicKey: Boolean(EMAILJS_CONFIG.publicKey),
      });
      setStatus("error");
      setErrorMessage(
        "İletişim servisi yapılandırması eksik olduğu için mesajınız gönderilemedi. Lütfen aşağıdaki e-posta veya telefon bağlantısını kullanın.",
      );
      return;
    }

    inFlightRef.current = true;
    setStatus("sending");
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim() || "-";
    const trimmedSubject = subject.trim() || "Genel";
    const trimmedLocation = location.trim();
    const formattedMessage = trimmedLocation
      ? `Proje Konumu: ${trimmedLocation}\n\n${message.trim()}`
      : message.trim();

    const templateParams: Record<string, unknown> = {
      from_name: trimmedName,
      name: trimmedName,
      user_name: trimmedName,
      reply_to: trimmedEmail,
      email: trimmedEmail,
      user_email: trimmedEmail,
      from_email: trimmedEmail,
      phone: trimmedPhone,
      user_phone: trimmedPhone,
      subject: trimmedSubject,
      message: formattedMessage,
      to_email: EMAILJS_CONFIG.toEmail,
    };

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        {
          publicKey: EMAILJS_CONFIG.publicKey,
          limitRate: {
            id: "kuk-contact-form",
            throttle: 15000,
          },
        },
      );

      if (response.status < 200 || response.status >= 300) {
        throw new EmailJSResponseStatus(response.status, response.text);
      }

      setSentRecipientName(trimmedName);
      resetForm();
      setStatus("sent");
      window.requestAnimationFrame(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch (error) {
      if (error instanceof EmailJSResponseStatus) {
        console.error("[KUK Contact / EmailJS] Gönderim hatası:", {
          status: error.status,
          text: error.text,
          serviceId: EMAILJS_CONFIG.serviceId,
          templateId: EMAILJS_CONFIG.templateId,
        });
        if (error.status === 429) {
          setErrorMessage(
            "Kısa süre içinde birden fazla gönderim denendi. Lütfen birkaç saniye bekleyip tekrar deneyin.",
          );
        } else {
          setErrorMessage(
            "Mesajınız şu anda otomatik olarak iletilemedi. Girdiğiniz bilgiler korundu; tekrar deneyebilir ya da doğrudan e-posta ve telefon üzerinden bize ulaşabilirsiniz.",
          );
        }
      } else {
        console.error("[KUK Contact / EmailJS] Beklenmeyen ağ veya istemci hatası:", error);
        setErrorMessage(
          "Bağlantı kaynaklı bir sorun nedeniyle mesajınız iletilemedi. Bilgileriniz korundu; lütfen bağlantınızı kontrol edip tekrar deneyin.",
        );
      }
      setStatus("error");
      window.requestAnimationFrame(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } finally {
      inFlightRef.current = false;
    }
  };

  const isSending = status === "sending";

  return (
    <section
      className="sgi-section sgi-theme-limestone sgi-after-hero"
      id="iletisim-formu"
      aria-labelledby="contact-heading"
    >
      <div className="sgi-container lux-atelier-grid">
        {/* SOL SÜTUN — DİNGİN ÖN GÖRÜŞME REHBERİ */}
        <div className="lux-atelier-aside">
          <SigEyebrow index="02">ÖN GÖRÜŞME FORMU</SigEyebrow>
          <h2 id="contact-heading" className="sgi-h2" data-sgi="words">
            <SigWords text="İlk değerlendirme için kısa bir çerçeve yeterli." />
          </h2>
          <p className="sgi-prose" style={{ marginTop: 18 }} data-sgi="rise">
            Projenizin tüm paftalarının hazır olması gerekmez. Elinizdeki temel bilgileri paylaşmanız ilk görüşmeyi verimli kılar.
          </p>

          <div className="lux-atelier-notes" data-sgi="stagger">
            {PREP_NOTES.map((item) => (
              <div key={item.n} className="lux-atelier-note">
                <span>{item.n}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lux-atelier-region" data-sgi="rise">
            <small>HİZMET BÖLGESİ · KOCAELİ</small>
            <p>
              Başiskele merkez ofisimizden İzmit ve Kocaeli çevresindeki konut, ticari ve karma kullanımlı yapılar için görüşme ve yerinde keşif planlıyoruz.
            </p>
          </div>
        </div>

        {/* SAĞ SÜTUN — SADE VE ESTETİK ATÖLYE FORMU */}
        <div className="lux-atelier-form-col" ref={panelRef} data-sgi="rise">
          <div className="lux-form-card">
            {status === "sent" ? (
              <div className="form-success" role="status" aria-live="polite" style={{ minHeight: 380 }}>
                <div className="success-icon">
                  <Check size={26} />
                </div>
                <span className="micro-label">MESAJINIZ İLETİLDİ</span>
                <h3 style={{ marginTop: 14, fontSize: "clamp(26px, 2.8vw, 34px)" }}>
                  Teşekkürler{sentRecipientName ? `, ${sentRecipientName}` : ""}.
                </h3>
                <p style={{ maxWidth: "46ch", margin: "16px 0 28px", fontSize: 15.5, lineHeight: 1.72 }}>
                  Mesajınız doğrudan {COMPANY.name} ekibine ({EMAILJS_CONFIG.toEmail}) iletildi. Talebinizi inceleyerek en kısa sürede size dönüş yapacağız.
                </p>
                <button
                  className="t-button t-primary sgi-cta-btn"
                  type="button"
                  aria-label="Yeni bir mesaj gönder"
                  onClick={() => setStatus("idle")}
                >
                  YENİ MESAJ GÖNDER <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                aria-label="İletişim ve ön görüşme formu"
                data-ga-event="iletisim_formu_gonder"
                data-ga-category="form"
              >
                <div className="sgi-form-top">
                  <span>PROJE VE ÖN GÖRÜŞME TALEBİ</span>
                  <span>* ZORUNLU ALANLAR</span>
                </div>

                {/* Honeypot alanı */}
                <div className="contact-honeypot" aria-hidden="true">
                  <label htmlFor="contact-website-url">Web sitesi</label>
                  <input
                    id="contact-website-url"
                    name="website_url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {status === "error" && errorMessage && (
                  <div
                    className="contact-form-alert"
                    role="alert"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "20px minmax(0, 1fr)",
                      gap: 12,
                      padding: "16px 18px",
                      marginBottom: 24,
                      borderRadius: 14,
                      border: "1px solid rgba(166, 47, 34, 0.34)",
                      background: "rgba(166, 47, 34, 0.06)",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    <AlertCircle size={18} style={{ color: "#a62f22", marginTop: 2 }} />
                    <div>
                      <strong style={{ display: "block", color: "#7f2117" }}>Mesajınız gönderilemedi.</strong>
                      <p style={{ marginTop: 4 }}>{errorMessage}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px", marginTop: 10 }}>
                        <a href={buildFallbackMailto()} className="sgi-link">
                          <Mail size={13} /> {EMAILJS_CONFIG.toEmail}
                        </a>
                        <a href={`tel:${COMPANY.phoneHref}`} className="sgi-link">
                          <Phone size={13} /> {COMPANY.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <div className="sgi-topic-strip">
                  <span>İLGİLENDİĞİNİZ KONU *</span>
                  <div className="sgi-topic-pills" role="group" aria-label="Konu seçimi">
                    {QUICK_TOPICS.map((topic) => {
                      const selected = subject === topic.value;
                      return (
                        <button
                          key={topic.label}
                          type="button"
                          disabled={isSending}
                          aria-pressed={selected}
                          className={`sgi-topic-pill${selected ? " is-selected" : ""}`}
                          onClick={() => {
                            setSubject(topic.value);
                            clearFieldError("subject");
                          }}
                        >
                          {topic.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sgi-fields">
                  <label className="sgi-field">
                    <span>Ad soyad *</span>
                    <input
                      id="contact-field-name"
                      name="name"
                      type="text"
                      required
                      disabled={isSending}
                      autoComplete="name"
                      placeholder="Adınız ve soyadınız"
                      value={name}
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? "err-name" : undefined}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearFieldError("name");
                      }}
                    />
                    {fieldErrors.name && (
                      <small id="err-name" className="contact-field-error">
                        {fieldErrors.name}
                      </small>
                    )}
                  </label>

                  <label className="sgi-field">
                    <span>E-posta adresi *</span>
                    <input
                      id="contact-field-email"
                      name="email"
                      type="email"
                      required
                      disabled={isSending}
                      autoComplete="email"
                      placeholder="ad@ornek.com"
                      value={email}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? "err-email" : undefined}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError("email");
                      }}
                    />
                    {fieldErrors.email && (
                      <small id="err-email" className="contact-field-error">
                        {fieldErrors.email}
                      </small>
                    )}
                  </label>

                  <label className="sgi-field">
                    <span>Telefon numarası</span>
                    <input
                      id="contact-field-phone"
                      name="phone"
                      type="tel"
                      disabled={isSending}
                      autoComplete="tel"
                      placeholder="+90 5XX XXX XX XX"
                      value={phone}
                      aria-invalid={Boolean(fieldErrors.phone)}
                      aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearFieldError("phone");
                      }}
                    />
                    {fieldErrors.phone && (
                      <small id="err-phone" className="contact-field-error">
                        {fieldErrors.phone}
                      </small>
                    )}
                  </label>

                  <label className="sgi-field">
                    <span>Proje konumu</span>
                    <input
                      name="location"
                      type="text"
                      disabled={isSending}
                      placeholder="İlçe / mahalle (isteğe bağlı)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </label>

                  <label className="sgi-field sgi-field--full">
                    <span>Proje veya talebiniz *</span>
                    <textarea
                      id="contact-field-message"
                      name="message"
                      rows={4}
                      required
                      disabled={isSending}
                      placeholder="Yapı türü, yaklaşık büyüklük ve projenizin mevcut aşamasını kısaca paylaşabilirsiniz."
                      value={message}
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={fieldErrors.message ? "err-message" : undefined}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        clearFieldError("message");
                      }}
                    />
                    {fieldErrors.message && (
                      <small id="err-message" className="contact-field-error">
                        {fieldErrors.message}
                      </small>
                    )}
                  </label>
                </div>

                <div className="sgi-consent">
                  <label>
                    <input
                      id="contact-field-kvkk"
                      name="kvkk"
                      type="checkbox"
                      required
                      disabled={isSending}
                      checked={kvkk}
                      aria-invalid={Boolean(fieldErrors.kvkk)}
                      aria-describedby={fieldErrors.kvkk ? "err-kvkk" : undefined}
                      onChange={(e) => {
                        setKvkk(e.target.checked);
                        clearFieldError("kvkk");
                      }}
                    />
                    <span>
                      <a
                        href={kvkkHref}
                        className="lg-inline-link"
                        onClick={(event) => {
                          event.preventDefault();
                          setKvkkOpen(true);
                        }}
                      >
                        Gizlilik Politikası ve KVKK Aydınlatma Metni
                      </a>
                      ’ni okudum; iletişim bilgilerimin talebimin değerlendirilmesi ve tarafıma dönüş yapılması amacıyla {COMPANY.name} tarafından işlenmesini kabul ediyorum. *
                    </span>
                  </label>
                  {fieldErrors.kvkk && (
                    <small
                      id="err-kvkk"
                      className="contact-field-error contact-field-error--consent"
                      style={{ display: "block", marginTop: 8, fontSize: 12.5 }}
                    >
                      {fieldErrors.kvkk}
                    </small>
                  )}
                </div>

                <div className="sgi-submit-row">
                  <p>
                    Doğrudan {COMPANY.name} mühendislik ekibine iletilir.
                  </p>
                  <button
                    className="t-button t-primary contact-submit-btn sgi-cta-btn"
                    type="submit"
                    disabled={isSending}
                    aria-busy={isSending}
                    aria-label={isSending ? "Mesajınız gönderiliyor" : "Mesajı gönder"}
                    data-cursor-magnetic={!isSending ? true : undefined}
                  >
                    <span data-magnetic-inner>
                      {isSending ? (
                        <>
                          GÖNDERİLİYOR... <Loader2 size={14} className="contact-spinner" />
                        </>
                      ) : (
                        <>
                          MESAJI GÖNDER <ArrowRight size={14} />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <KvkkDialog open={kvkkOpen} onClose={closeKvkk} />
    </section>
  );
}
