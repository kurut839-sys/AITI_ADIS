
const whatsapp =
  "https://wa.me/996558553177?text=Здравствуйте!%20Хочу%20записаться%20на%20обучение%20в%20IT%20ADIS";

export default function Home({ setPage }) {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">IT EDUCATION CENTER</span>

          <h1>
            ТВОЁ БУДУЩЕЕ
            <br />
            <span>НАЧИНАЕТСЯ ЗДЕСЬ</span>
          </h1>

          <p>
            Получи востребованную IT-профессию вместе с
            <span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span>.
            Учись, создавай проекты и открывай новые возможности.
          </p>

          <div className="hero-buttons">
            <a className="btn-primary" href={whatsapp} target="_blank" rel="noreferrer">
              Начать обучение ↗
            </a>

            <button className="btn-secondary" onClick={() => setPage("courses")}>
              Наши курсы
            </button>
          </div>

          <div className="stats">
            <div><strong>5+</strong><span>Лет опыта</span></div>
            <div><strong>2000+</strong><span>Выпускников</span></div>
            <div><strong>3</strong><span>Направления</span></div>
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
          <span className="brand"><span className="brand-it">ПОЧЕМУ </span><span className="brand-it">IT</span><span className="brand-adis">adis</span>?</span>
          <h2>Открой для себя мир <span>IT</span></h2>
          <p>Получай знания и развивай навыки вместе с нами.</p>
        </div>

        <div className="features">
          <div className="feature">
            <b>01</b>
            <h3>Практика</h3>
            <p>Закрепляй знания на учебных проектах.</p>
          </div>
          <div className="feature">
            <b>02</b>
            <h3>Опыт</h3>
            <p>Обучение с преподавателями-практиками.</p>
          </div>
          <div className="feature">
            <b>03</b>
            <h3>Результат</h3>
            <p>Создай собственное портфолио.</p>
          </div>
        </div>
      </section>
    </>
  );
}
