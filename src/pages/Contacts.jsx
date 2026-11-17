
import { useI18n } from "../lib/i18n";

const mapLink =
  "https://2gis.kg/bishkek/search/Чынгыз%20Айтматов%20проспекти%2C%20421";

export default function Contacts() {
  const { language, t } = useI18n();
  const whatsappMessage = language === "kg"
    ? "Саламатсызбы! IT ADIS курстары тууралуу кененирээк маалымат алгым келет."
    : "Здравствуйте! Хочу узнать подробнее о курсах IT ADIS";
  const whatsapp = `https://wa.me/996558553177?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="page-container">
      <div className="section-title page-title">
        <span>{t("CONTACT US")}</span>
        <h1>{t("Наши ")}<span>{t("контакты")}</span></h1>
        <p>{t("Будем рады ответить на твои вопросы.")}</p>
      </div>

      <div className="contact-grid">
        <div className="contact-panel">
          <h2>{t("Давай начнём ")}<span className="brand"><span className="brand-it">{t("вместе")}</span><span className="brand-adis">!</span></span></h2>
          <p>{t("Напиши нам, чтобы узнать подробнее об обучении.")}</p>

          <div className="contact-item">
            <span>☎</span>
            <div>
              <small>{t("WHATSAPP / ТЕЛЕФОН")}</small>
              <a href="tel:+996558553177">+996 558 553 177</a>
            </div>
          </div>

          <div className="contact-item">
            <span>⌖</span>
            <div>
              <small>{t("АДРЕС")}</small>
              <p>{t("Проспект Чынгыза Айтматова, 421")}</p>
            </div>
          </div>

          <a className="btn-primary" href={whatsapp} target="_blank" rel="noreferrer">
            {t("Написать в WhatsApp ↗")}
          </a>

          <a className="btn-secondary map-button" href={mapLink} target="_blank" rel="noreferrer">
            {t("Открыть в 2ГИС ↗")}
          </a>
        </div>

        <div className="map-panel">
          <div className="map-placeholder">
            <span>⌖</span>
            <h3><span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span></h3>
            <p>{t("Проспект Чынгыза Айтматова, 421")}</p>
            <a href={mapLink} target="_blank" rel="noreferrer">
              {t("Посмотреть на карте ↗")}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
