import { useEffect, useState } from "react";
import { useI18n } from "../lib/i18n";

const courses = [
  {
    title: "Frontend-разработка",
    icon: "⌨",
    description:
      "Создавай современные сайты и интерфейсы, которыми удобно пользоваться.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    details:
      "Научись создавать адаптивные веб-страницы и интерактивные интерфейсы.",
  },
  {
    title: "Backend-разработка",
    icon: "▤",
    description:
      "Разбирайся, как устроена серверная часть сайтов и приложений.",
    skills: ["Программирование", "Серверы", "Базы данных"],
    details:
      "Изучи основы серверной разработки, работу с данными и создание API.",
  },
  {
    title: "Flutter-разработка",
    icon: "▯",
    description:
      "Освой создание мобильных приложений для разных устройств.",
    skills: ["Dart", "Flutter", "Мобильные приложения"],
    details:
      "Познакомься с Flutter и создай приложение с единым кодом для разных платформ.",
  },
];

export default function Courses({ user }) {
  const { language, t } = useI18n();
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (!selectedCourse) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setSelectedCourse(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCourse]);

  const studentName = user?.name
    ? language === "kg"
      ? ` Атым ${user.name}.`
      : ` Меня зовут ${user.name}.`
    : "";
  const enrollmentMessage = selectedCourse
    ? language === "kg"
      ? `Саламатсызбы!${studentName} «${t(selectedCourse.title)}» курсу тууралуу кененирээк маалымат алгым келет.`
      : `Здравствуйте!${studentName} Хочу узнать подробнее о курсе «${selectedCourse.title}».`
    : "";

  return (
    <main className="page-container">
      <div className="section-title page-title">
        <span>{t("OUR COURSES")}</span>
        <h1>{t("Выбери своё")} <span>{t("направление")}</span></h1>
        <p>{t("Получай практические навыки и создавай собственные проекты.")}</p>
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <article className="course-card" key={course.title}>
            <div className="course-icon" aria-hidden="true">{course.icon}</div>
            <h2>{t(course.title)}</h2>
            <p>{t(course.description)}</p>
            <div className="skill-list">{course.skills.map(t).join(" · ")}</div>
            <button
              className="btn-primary course-button"
              type="button"
              onClick={() => setSelectedCourse(course)}
            >
              {t("Подробнее")}
            </button>
          </article>
        ))}
      </div>

      {selectedCourse && (
        <div
          className="course-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedCourse(null);
          }}
        >
          <section
            className="course-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
          >
            <button
              className="modal-close"
              type="button"
              aria-label={t("Закрыть")}
              onClick={() => setSelectedCourse(null)}
            >
              ×
            </button>
            <h2 id="course-modal-title">{t(selectedCourse.title)}</h2>
            <p>{t(selectedCourse.details)}</p>
            <div className="skill-list">
              {selectedCourse.skills.map(t).join(" · ")}
            </div>
            <a
              className="btn-primary modal-enroll"
              href={`https://wa.me/996558553177?text=${encodeURIComponent(enrollmentMessage)}`}
              target="_blank"
              rel="noreferrer"
            >
              {t("Узнать о записи ↗")}
            </a>
          </section>
        </div>
      )}
    </main>
  );
}