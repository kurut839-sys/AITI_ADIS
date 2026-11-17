
import SettingsControls from "./SettingsControls";
import { useI18n } from "../lib/i18n";

const links = [
  ["Главная", "home"],
  ["Курсы", "courses"],
  ["Преподаватели", "teachers"],
  ["Сертификаты", "certificates"],
  ["Контакты", "contacts"],
];

export default function Header({ page, setPage }) {
  const { language, t } = useI18n();
  const contactMessage = language === "kg"
    ? "Саламатсызбы! IT ADIS курстары тууралуу билгим келет."
    : "Здравствуйте! Хочу узнать о курсах IT ADIS";

  return (
    <header className="header">
      <button className="logo" onClick={() => setPage("home")}>
        <div className="logo-circle">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt={t("Логотип IT ADIS")} />
        </div>
        <div>
          <h2 className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></h2>
        </div>
      </button>

      <nav className="navigation">
        {links.map(([name, id]) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={page === id ? "nav-link active" : "nav-link"}
          >
            {t(name)}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <SettingsControls />
        <a
          className="header-contact"
          href={`https://wa.me/996558553177?text=${encodeURIComponent(contactMessage)}`}
          target="_blank"
          rel="noreferrer"
        >
          {t("Связаться ↗")}
        </a>
      </div>
    </header>
  );
}
