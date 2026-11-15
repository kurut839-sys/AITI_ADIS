import { useEffect, useState } from "react";
import { getMediaUrl, supabase } from "../lib/supabase";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCertificates() {
      if (!supabase) {
        setError("Не настроено подключение к галерее сертификатов.");
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("certificates")
        .select("id, description, photo_path, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (queryError) {
        setError(queryError.message);
      } else {
        setCertificates(data);
      }
      setLoading(false);
    }

    loadCertificates().catch((loadError) => {
      if (!active) return;
      setError(loadError.message || "Не удалось загрузить сертификаты.");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="page-container">
      <div className="section-title page-title">
        <span>OUR ACHIEVEMENTS</span>
        <h1>Наши <span>сертификаты</span></h1>
        <p>Результаты обучения и достижения наших студентов.</p>
      </div>

      {loading ? (
        <div className="empty-upload"><p>Загружаем сертификаты...</p></div>
      ) : error ? (
        <div className="empty-upload">
          <h3>Не удалось загрузить сертификаты</h3>
          <p>{error}</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="empty-upload">
          <span>＋</span>
          <h3>Пока нет опубликованных сертификатов</h3>
        </div>
      ) : (
        <div className="uploaded-grid">
          {certificates.map((certificate) => (
            <article className="uploaded-card" key={certificate.id}>
              <img
                src={getMediaUrl(certificate.photo_path)}
                alt="Сертификат"
              />
              {certificate.description && (
                <p className="certificate-public-description">
                  {certificate.description}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
