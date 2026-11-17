
import { useI18n } from "../lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div>
        <h2 className="footer-logo brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></h2>
        <p>{t("Образование, которое открывает возможности.")}</p>
      </div>

      <div>
        <h3>{t("Наши контакты")}</h3>
        <a href="https://wa.me/996558553177" target="_blank" rel="noreferrer">
          +996 558 553 177
        </a>
        <p>{t("Проспект Чынгыза Айтматова, 421")}</p>
      </div>

      <a href={`${import.meta.env.BASE_URL}admin`}>{t("Вход администратора")}</a><div className="footer-bottom">
        © 2026 <span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span>. {t("Все права защищены.")}
      </div>
    </footer>
  );
}
