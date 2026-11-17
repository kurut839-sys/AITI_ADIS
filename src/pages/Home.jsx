
import { useI18n } from "../lib/i18n";

const whatsapp =
  "https://wa.me/996558553177?text=Здравствуйте!%20Хочу%20записаться%20на%20обучение%20в%20IT%20ADIS";

export default function Home({ setPage }) {
  const { language, t } = useI18n();
  const contactUrl = language === "kg"
    ? "https://wa.me/996558553177?text=Саламатсызбы!%20IT%20ADISке%20окууга%20катталгым%20келет."
    : whatsapp;

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">{t("IT EDUCATION CENTER")}</span>

          <h1>
            {t("ТВОЁ БУДУЩЕЕ")}
            <br />
            <span>{t("НАЧИНАЕТСЯ ЗДЕСЬ")}</span>
          </h1>

          <p>
            {language === "kg" ? (
              <>
                IT <span className="brand-adis">adis</span> менен бирге IT кесибин үйрөн.
                Оку, долбоорлорду түз жана жаңы мүмкүнчүлүктөрдү ач.
              </>
            ) : (
              <>
                Получай востребованную IT-профессию вместе с{" "}
                <span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span>.
                {" "}Учись, создавай проекты и открывай новые возможности.
              </>
            )}
          </p>

          <div className="hero-buttons">
            <a className="btn-primary" href={contactUrl} target="_blank" rel="noreferrer">
              {t("Начать обучение ↗")}
            </a>

            <button className="btn-secondary" onClick={() => setPage("courses")}>
              {t("Наши курсы")}
            </button>
          </div>

          <div className="stats">
            <div><strong>5+</strong><span>{t("Лет опыта")}</span></div>
            <div><strong>2000+</strong><span>{t("Выпускников")}</span></div>
            <div><strong>3</strong><span>{t("Направления")}</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow-circle"></div>

          <div className="main-logo">
            <div className="main-logo-icon">A</div>
            <h2 className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></h2>
          </div>

          <div className="floating-card card-one">⌨<b>Frontend</b></div>
          <div className="floating-card card-two">▤<b>Backend</b></div>
          <div className="floating-card card-three">▯<b>Flutter</b></div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <span className="brand"><span className="brand-it">{t("ПОЧЕМУ ")}</span><span className="brand-it">IT</span><span className="brand-adis">adis</span>?</span>
          <h2>
            {language === "kg" ? (
              <><span>IT</span> дүйнөсүн ач</>
            ) : (
              <>Открой для себя мир <span>IT</span></>
            )}
          </h2>
          <p>{t("Получай знания и развивай навыки вместе с нами.")}</p>
        </div>

        <div className="features">
          <div className="feature">
            <b>01</b>
            <h3>{t("Практика")}</h3>
            <p>{t("Закрепляй знания на учебных проектах.")}</p>
          </div>
          <div className="feature">
            <b>02</b>
            <h3>{t("Опыт")}</h3>
            <p>{t("Обучение с преподавателями-практиками.")}</p>
          </div>
          <div className="feature">
            <b>03</b>
            <h3>{t("Результат")}</h3>
            <p>{t("Создай собственное портфолио.")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
