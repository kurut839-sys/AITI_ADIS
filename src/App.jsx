
import { lazy, Suspense, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import SettingsControls from "./components/SettingsControls.jsx";
import { useI18n } from "./lib/i18n";

const Home = lazy(() => import("./pages/Home.jsx"));
const Courses = lazy(() => import("./pages/Courses.jsx"));
const Teachers = lazy(() => import("./pages/Teachers.jsx"));
const Certificates = lazy(() => import("./pages/Certificates.jsx"));
const Contacts = lazy(() => import("./pages/Contacts.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));

export default function App() {
  const { language, t } = useI18n();
  const isAdminRoute = window.location.pathname.replace(/\/+$/, "") === `${import.meta.env.BASE_URL}admin`;
  const [page, setPage] = useState("home");

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("itadis-user")) || null;
    } catch {
      return null;
    }
  });

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  function handleEnter(event) {
    event.preventDefault();

    const cleanName = name.trim();
    const numericAge = Number(age);

    if (cleanName.length < 2) {
      setError(t("Введите имя (минимум 2 символа)."));
      return;
    }

    if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
      setError(t("Введите корректный возраст."));
      return;
    }

    const newUser = {
      name: cleanName,
      age: numericAge,
    };

    localStorage.setItem("itadis-user", JSON.stringify(newUser));
    setUser(newUser);
    setError("");
  }

  function changePage(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isAdminRoute) {
    return (
      <div className="admin-shell">
        <SettingsControls floating />
        <Suspense fallback={<main className="admin-page"><p>{t("Загружаем панель...")}</p></main>}>
          <Admin />
        </Suspense>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="welcome-screen">
        <div className="welcome-glow"></div>

        <form className="welcome-card" onSubmit={handleEnter}>
          <div className="welcome-settings">
            <SettingsControls />
          </div>
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="IT ADIS"
            className="welcome-logo"
          />

          <span className="eyebrow"><span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span> {t("EDUCATION")}</span>

          <h1>
            {language === "kg" ? (
              <>
                <span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span>ке
                {" "}кош келиңиз!
              </>
            ) : (
              <>
                {t("Добро пожаловать")}
                <br />
                в <span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span>!
              </>
            )}
          </h1>

          <p>
            {t("Перед началом знакомства с нашими курсами расскажи немного о себе.")}
          </p>

          <div className="welcome-fields">
            <label htmlFor="student-name">{t("Как тебя зовут?")}</label>
            <input
              id="student-name"
              type="text"
              placeholder={t("Введи своё имя")}
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="student-age">{t("Сколько тебе лет?")}</label>
            <input
              id="student-age"
              type="number"
              placeholder={t("Введи свой возраст")}
              value={age}
              min="1"
              max="120"
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {error && <p className="welcome-error">{error}</p>}

          <button type="submit" className="btn-primary welcome-submit">
            {t("Перейти на сайт ↗")}
          </button>

          <small>{t("Твои данные сохраняются только в этом браузере.")}</small>
        </form>
      </main>
    );
  }

  return (
    <>
      <Header page={page} setPage={changePage} />

      <Suspense fallback={<main className="page-container"><p>{t("Загружаем страницу...")}</p></main>}>
        {page === "home" && <Home setPage={changePage} />}
        {page === "courses" && <Courses user={user} />}
        {page === "teachers" && <Teachers />}
        {page === "certificates" && <Certificates />}
        {page === "contacts" && <Contacts user={user} />}
      </Suspense>

      <Footer />
    </>
  );
}
