import { useState } from "react";

const courses = [
  {
    title: "Frontend",
    icon: "</>",
    description: "Создавай сайты и интерактивные интерфейсы для веба.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    title: "Backend",
    icon: "{ }",
    description: "Изучай серверную разработку и создание веб-сервисов.",
    skills: ["Серверная логика", "API", "Базы данных"],
  },
  {
    title: "Flutter",
    icon: "▯",
    description: "Знакомься с разработкой приложений для мобильных устройств.",
    skills: ["Dart", "Flutter", "Мобильные приложения"],
  },
];

export default function Courses({ user }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const studentName = typeof user?.name === "string" ? user.name.trim() : "";
  const enrollmentMessage = selectedCourse
    ? `Здравствуйте!${studentName ? ` Меня зовут ${studentName}.` : ""} Хочу узнать подробнее о курсе ${selectedCourse.title} в IT ADIS.`
    : "";
  const enrollmentLink = `https://wa.me/996558553177?text=${encodeURIComponent(enrollmentMessage)}`;

  return (
    <main className="page-container">
      <div className="section-title page-title">
        <span>OUR COURSES</span>
        <h1>Выбери своё <span>направление</span></h1>
        <p>Изучай технологии и создавай собственные проекты.</p>
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <article className="course-card" key={course.title}>
            <div className="course-icon" aria-hidden="true">{course.icon}</div>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <div className="skill-list">{course.skills.join(" · ")}</div>
            <button
              className="btn-primary course-button"
              type="button"
              onClick={() => setSelectedCourse(course)}
            >
              Подробнее
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
              aria-label="Закрыть"
              onClick={() => setSelectedCourse(null)}
            >
              ×
            </button>
            <h2 id="course-modal-title">{selectedCourse.title}</h2>
            <p>{selectedCourse.description}</p>
            <div className="skill-list">
              Что изучают: {selectedCourse.skills.join(" · ")}
            </div>
            <a
              className="btn-primary modal-enroll"
              href={enrollmentLink}
              target="_blank"
              rel="noreferrer"
            >
              Узнать о курсе в WhatsApp ↗
            </a>
          </section>
        </div>
      )}
    </main>
  );
}
