
import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";
import Certificates from "./pages/Certificates";
import Contacts from "./pages/Contacts";
import Admin from "./pages/Admin";

export default function App() {
  const isAdminRoute = window.location.pathname.replace(/\/+$/, "") === "/admin";
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
      setError("Введите имя (минимум 2 символа).");
      return;
    }

    if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
      setError("Введите корректный возраст.");
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
    return <Admin />;
  }

  if (!user) {
    return (
      <main className="welcome-screen">
        <div className="welcome-glow"></div>

        <form className="welcome-card" onSubmit={handleEnter}>
          <img
            src="/images/logo.png"
            alt="IT ADIS"
            className="welcome-logo"
          />

          <span className="eyebrow"><span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span> EDUCATION</span>

          <h1>
            Добро пожаловать
            <br />
            в <span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span>!
          </h1>

          <p>
            Перед началом знакомства с нашими курсами
            расскажи немного о себе.
          </p>

          <div className="welcome-fields">
            <label htmlFor="student-name">Как тебя зовут?</label>
            <input
              id="student-name"
              type="text"
              placeholder="Введи своё имя"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="student-age">Сколько тебе лет?</label>
            <input
              id="student-age"
              type="number"
              placeholder="Введи свой возраст"
              value={age}
              min="1"
              max="120"
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {error && <p className="welcome-error">{error}</p>}

          <button type="submit" className="btn-primary welcome-submit">
            Перейти на сайт ↗
          </button>

          <small>Твои данные сохраняются только в этом браузере.</small>
        </form>
      </main>
    );
  }

  return (
    <>
      <Header page={page} setPage={changePage} />

      {page === "home" && <Home setPage={changePage} />}
      {page === "courses" && <Courses user={user} />}
      {page === "teachers" && <Teachers />}
      {page === "certificates" && <Certificates />}
      {page === "contacts" && <Contacts user={user} />}

      <Footer />
    </>
  );
}
