import { useEffect, useState } from "react";
import { getMediaUrl, supabase } from "../lib/supabase";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTeachers() {
      if (!supabase) {
        setError("Не настроено подключение к списку преподавателей.");
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("teachers")
        .select("id, name, experience, specialty, description, photo_path")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (queryError) {
        setError(queryError.message);
      } else {
        setTeachers(data);
      }
      setLoading(false);
    }

    loadTeachers().catch((loadError) => {
      if (!active) return;
      setError(loadError.message || "Не удалось загрузить преподавателей.");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="page-container">
      <div className="section-title page-title">
        <span>OUR TEAM</span>
        <h1>Наши <span>преподаватели</span></h1>
        <p>
          Знакомьтесь с командой{" "}
          <span className="brand">
            <span className="brand-it">IT</span>
            <span className="brand-adis">adis</span>
          </span>.
        </p>
      </div>

      {loading ? (
        <div className="empty-upload"><p>Загружаем преподавателей...</p></div>
      ) : error ? (
        <div className="empty-upload">
          <h3>Не удалось загрузить преподавателей</h3>
          <p>{error}</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="empty-upload">
          <span>＋</span>
          <h3>Пока нет опубликованных преподавателей</h3>
        </div>
      ) : (
        <div className="teacher-list">
          {teachers.map((teacher) => (
            <article className="teacher-card" key={teacher.id}>
              {teacher.photo_path ? (
                <img
                  className="teacher-photo"
                  src={getMediaUrl(teacher.photo_path)}
                  alt={teacher.name}
                />
              ) : (
                <div className="teacher-photo teacher-photo-empty">Фото</div>
              )}
              <h3>{teacher.name}</h3>
              <span className="teacher-role">{teacher.specialty}</span>
              <p>{teacher.description}</p>
              <div className="teacher-meta">Стаж: {teacher.experience}</div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
