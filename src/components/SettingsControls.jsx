import { useI18n } from "../lib/i18n";

export default function SettingsControls({ floating = false }) {
  const { language, setLanguage, theme, toggleTheme, t } = useI18n();

  return (
    <div
      className={`site-settings${floating ? " site-settings-floating" : ""}`}
      role="group"
      aria-label={t("Настройки отображения")}
    >
      <div className="language-switch" role="group" aria-label={t("Язык интерфейса")}>
        <button
          type="button"
          aria-label={t("Переключить на кыргызский язык")}
          aria-pressed={language === "kg"}
          className={language === "kg" ? "selected" : ""}
          onClick={() => setLanguage("kg")}
        >
          KG
        </button>
        <button
          type="button"
          aria-label={t("Переключить на русский язык")}
          aria-pressed={language === "ru"}
          className={language === "ru" ? "selected" : ""}
          onClick={() => setLanguage("ru")}
        >
          RU
        </button>
      </div>
      <button
        type="button"
        className="theme-toggle"
        aria-label={t(theme === "dark" ? "Включить дневной режим" : "Включить ночной режим")}
        title={t(theme === "dark" ? "Включить дневной режим" : "Включить ночной режим")}
        onClick={toggleTheme}
      >
        <span className="theme-toggle-icon" aria-hidden="true">
          {theme === "dark" ? "☀" : "☾"}
        </span>
        <span className="theme-toggle-label">{t(theme === "dark" ? "День" : "Ночь")}</span>
      </button>
    </div>
  );
}
