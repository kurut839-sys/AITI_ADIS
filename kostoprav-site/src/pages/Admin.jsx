import { useCallback, useEffect, useState } from "react";
import { getMediaUrl, supabase } from "../lib/supabase";

const EMPTY_TEACHER = {
  name: "",
  experience: "",
  specialty: "",
  description: "",
  photoPath: "",
};

const EMPTY_CERTIFICATE = {
  description: "",
  photoPath: "",
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getErrorMessage(error) {
  return error?.message || "Произошла неизвестная ошибка.";
}

function autoResizeTextarea(event) {
  event.target.style.height = "auto";
  event.target.style.height = `${event.target.scrollHeight}px`;
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMode, setAuthMode] = useState("sign-in");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [activeTab, setActiveTab] = useState("teachers");
  const [teachers, setTeachers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [teacherDraft, setTeacherDraft] = useState(EMPTY_TEACHER);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherFile, setTeacherFile] = useState(null);
  const [teacherFileKey, setTeacherFileKey] = useState(0);
  const [certificateDraft, setCertificateDraft] = useState(EMPTY_CERTIFICATE);
  const [editingCertificateId, setEditingCertificateId] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificateFileKey, setCertificateFileKey] = useState(0);
  const [adminUserId, setAdminUserId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
      }
    });

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      setAuthLoading(false);
    }).catch((sessionError) => {
      if (!active) return;
      setError(getErrorMessage(sessionError));
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (!supabase || !session) return;

    setDashboardLoading(true);
    setError("");

    try {
      const { data: membership, error: membershipError } = await supabase
        .from("site_admins")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;

      const hasAdminAccess = Boolean(membership);
      setIsAdmin(hasAdminAccess);

      if (!hasAdminAccess) {
        setTeachers([]);
        setCertificates([]);
        setAdmins([]);
        return;
      }

      const [teacherResult, certificateResult, adminResult] = await Promise.all([
        supabase.from("teachers").select("*").order("created_at", { ascending: false }),
        supabase.from("certificates").select("*").order("created_at", { ascending: false }),
        supabase.from("site_admins").select("user_id, created_at").order("created_at", { ascending: true }),
      ]);

      if (teacherResult.error) throw teacherResult.error;
      if (certificateResult.error) throw certificateResult.error;
      if (adminResult.error) throw adminResult.error;

      setTeachers(teacherResult.data);
      setCertificates(certificateResult.data);
      setAdmins(adminResult.data);
    } finally {
      setDashboardLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      setDashboardLoading(false);
      setTeachers([]);
      setCertificates([]);
      setAdmins([]);
      return;
    }

    refreshDashboard().catch((loadError) => {
      setError(getErrorMessage(loadError));
    });
  }, [session, refreshDashboard]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    if (!supabase) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      if (authMode === "sign-up") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: authForm.email.trim(),
          password: authForm.password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });
        if (authError) throw authError;
        const userId = data.user?.id;
        setNotice(
          userId
            ? `Аккаунт создан. UUID: ${userId}. Подтвердите email, если Supabase запросит подтверждение.`
            : "Аккаунт создан. Проверьте почту для подтверждения.",
        );
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: authForm.email.trim(),
          password: authForm.password,
        });
        if (authError) throw authError;
      }
    } catch (authError) {
      setError(getErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    setBusy(true);
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setNotice("");
    } catch (signOutError) {
      setError(getErrorMessage(signOutError));
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file) {
    if (!IMAGE_TYPES.includes(file.type)) {
      throw new Error("Поддерживаются JPG, PNG, WEBP и GIF.");
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Размер изображения не должен превышать 5 МБ.");
    }

    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const path = `${session.user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("site-media")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;
    return path;
  }

  async function removeImage(path) {
    if (!path) return;
    const { error: removeError } = await supabase.storage
      .from("site-media")
      .remove([path]);
    if (removeError) throw removeError;
  }

  function resetTeacherForm() {
    setTeacherDraft(EMPTY_TEACHER);
    setEditingTeacherId(null);
    setTeacherFile(null);
    setTeacherFileKey((key) => key + 1);
  }

  function resetCertificateForm() {
    setCertificateDraft(EMPTY_CERTIFICATE);
    setEditingCertificateId(null);
    setCertificateFile(null);
    setCertificateFileKey((key) => key + 1);
  }

  async function saveTeacher(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    let uploadedPath = "";
    let recordSaved = false;
    let cleanupWarning = "";

    try {
      if (!teacherDraft.name.trim() || !teacherDraft.experience.trim() || !teacherDraft.specialty.trim()) {
        throw new Error("Заполните имя, стаж и специализацию преподавателя.");
      }

      if (teacherFile) uploadedPath = await uploadImage(teacherFile);

      const payload = {
        name: teacherDraft.name.trim(),
        experience: teacherDraft.experience.trim(),
        specialty: teacherDraft.specialty.trim(),
        description: teacherDraft.description.trim(),
        photo_path: uploadedPath || teacherDraft.photoPath || null,
        published: editingTeacherId
          ? teachers.find((teacher) => teacher.id === editingTeacherId)?.published ?? false
          : false,
        updated_at: new Date().toISOString(),
      };

      const result = editingTeacherId
        ? await supabase.from("teachers").update(payload).eq("id", editingTeacherId).select().single()
        : await supabase.from("teachers").insert(payload).select().single();

      if (result.error) throw result.error;
      recordSaved = true;
      if (uploadedPath && teacherDraft.photoPath) {
        try {
          await removeImage(teacherDraft.photoPath);
        } catch (cleanupError) {
          cleanupWarning = `Данные сохранены, но старое фото удалить не удалось: ${getErrorMessage(cleanupError)}`;
        }
      }

      resetTeacherForm();
      setNotice(editingTeacherId ? "Данные преподавателя сохранены." : "Преподаватель добавлен.");
      await refreshDashboard();
      if (cleanupWarning) setError(cleanupWarning);
    } catch (saveError) {
      if (uploadedPath && !recordSaved) {
        try {
          await removeImage(uploadedPath);
        } catch (cleanupError) {
          setError(`${getErrorMessage(saveError)} Не удалось удалить загруженное фото: ${getErrorMessage(cleanupError)}`);
          setBusy(false);
          return;
        }
      }
      setError(getErrorMessage(saveError));
    } finally {
      setBusy(false);
    }
  }

  async function saveCertificate(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    let uploadedPath = "";
    let recordSaved = false;
    let cleanupWarning = "";

    try {
      if (!editingCertificateId && !certificateFile) {
        throw new Error("Выберите изображение сертификата.");
      }

      if (certificateFile) uploadedPath = await uploadImage(certificateFile);

      const payload = {
        description: certificateDraft.description.trim(),
        photo_path: uploadedPath || certificateDraft.photoPath,
        published: editingCertificateId
          ? certificates.find((certificate) => certificate.id === editingCertificateId)?.published ?? false
          : false,
        updated_at: new Date().toISOString(),
      };

      const result = editingCertificateId
        ? await supabase.from("certificates").update(payload).eq("id", editingCertificateId).select().single()
        : await supabase.from("certificates").insert(payload).select().single();

      if (result.error) throw result.error;
      recordSaved = true;
      if (uploadedPath && certificateDraft.photoPath) {
        try {
          await removeImage(certificateDraft.photoPath);
        } catch (cleanupError) {
          cleanupWarning = `Данные сохранены, но старое фото удалить не удалось: ${getErrorMessage(cleanupError)}`;
        }
      }

      resetCertificateForm();
      setNotice(editingCertificateId ? "Сертификат сохранён." : "Сертификат добавлен.");
      await refreshDashboard();
      if (cleanupWarning) setError(cleanupWarning);
    } catch (saveError) {
      if (uploadedPath && !recordSaved) {
        try {
          await removeImage(uploadedPath);
        } catch (cleanupError) {
          setError(`${getErrorMessage(saveError)} Не удалось удалить загруженное фото: ${getErrorMessage(cleanupError)}`);
          setBusy(false);
          return;
        }
      }
      setError(getErrorMessage(saveError));
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(table, item) {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const { error: updateError } = await supabase
        .from(table)
        .update({ published: !item.published, updated_at: new Date().toISOString() })
        .eq("id", item.id)
        .select("id")
        .single();
      if (updateError) throw updateError;

      setNotice(item.published ? "Публикация снята." : "Материал опубликован для посетителей.");
      await refreshDashboard();
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    } finally {
      setBusy(false);
    }
  }

  async function deleteContent(table, item) {
    if (!window.confirm("Удалить материал и его фотографию?")) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq("id", item.id)
        .select("id")
        .single();
      if (deleteError) throw deleteError;

      let cleanupWarning = "";
      try {
        await removeImage(item.photo_path);
      } catch (imageError) {
        cleanupWarning = `Материал удалён, но фотографию удалить не удалось: ${getErrorMessage(imageError)}`;
      }

      await refreshDashboard();
      if (cleanupWarning) setError(cleanupWarning);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setBusy(false);
    }
  }

  function editTeacher(teacher) {
    setTeacherDraft({
      name: teacher.name,
      experience: teacher.experience,
      specialty: teacher.specialty,
      description: teacher.description,
      photoPath: teacher.photo_path || "",
    });
    setEditingTeacherId(teacher.id);
    setTeacherFile(null);
    setTeacherFileKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editCertificate(certificate) {
    setCertificateDraft({
      description: certificate.description,
      photoPath: certificate.photo_path,
    });
    setEditingCertificateId(certificate.id);
    setCertificateFile(null);
    setCertificateFileKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function addAdministrator(event) {
    event.preventDefault();
    const userId = adminUserId.trim();
    if (!UUID_PATTERN.test(userId)) {
      setError("Введите корректный UUID аккаунта Supabase.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const { error: insertError } = await supabase
        .from("site_admins")
        .insert({ user_id: userId })
        .select("user_id")
        .single();
      if (insertError) throw insertError;

      setAdminUserId("");
      setNotice("Права администратора переданы выбранному аккаунту.");
      await refreshDashboard();
    } catch (addError) {
      setError(getErrorMessage(addError));
    } finally {
      setBusy(false);
    }
  }

  async function removeAdministrator(userId) {
    if (!window.confirm("Снять права администратора с этого аккаунта?")) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const { error: deleteError } = await supabase
        .from("site_admins")
        .delete()
        .eq("user_id", userId)
        .select("user_id")
        .single();
      if (deleteError) throw deleteError;

      setNotice("Права администратора сняты.");
      await refreshDashboard();
    } catch (removeError) {
      setError(getErrorMessage(removeError));
    } finally {
      setBusy(false);
    }
  }

  if (!supabase) {
    return (
      <main className="admin-page">
        <section className="admin-panel">
          <h1>Панель администратора</h1>
          <p>Не настроено подключение Supabase. Проверьте переменные окружения сайта.</p>
        </section>
      </main>
    );
  }

  if (authLoading) {
    return <main className="admin-page"><p>Загружаем панель...</p></main>;
  }

  if (!session) {
    return (
      <main className="admin-page">
        <section className="admin-panel admin-auth-panel">
          <a className="admin-back-link" href="/">← На сайт</a>
          <h1>Панель администратора</h1>
          <p>Войдите в личный аккаунт владельца сайта.</p>

          <form className="admin-form" onSubmit={handleAuthSubmit}>
            <label>
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              />
            </label>
            <label>
              Пароль
              <input
                type="password"
                required
                minLength={8}
                autoComplete={authMode === "sign-in" ? "current-password" : "new-password"}
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              />
            </label>
            {error && <p className="admin-message admin-error" role="alert">{error}</p>}
            {notice && <p className="admin-message admin-success">{notice}</p>}
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? "Подождите..." : authMode === "sign-in" ? "Войти" : "Создать аккаунт"}
            </button>
          </form>

          <button
            type="button"
            className="admin-text-button"
            onClick={() => {
              setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in");
              setError("");
              setNotice("");
            }}
          >
            {authMode === "sign-in" ? "Создать личный аккаунт" : "Уже есть аккаунт? Войти"}
          </button>
        </section>
      </main>
    );
  }

  if (dashboardLoading && !isAdmin) {
    return <main className="admin-page"><p>Проверяем права доступа...</p></main>;
  }

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <section className="admin-panel">
          <div className="admin-topbar">
            <a className="admin-back-link" href="/">← На сайт</a>
            <button type="button" className="admin-secondary-button" onClick={handleSignOut} disabled={busy}>Выйти</button>
          </div>
          <h1>Доступ пока не назначен</h1>
          <p>UUID вашего аккаунта Supabase:</p>
          <code className="admin-user-uuid">{session.user.id}</code>
          <p className="admin-help">
            Если вы владелец проекта и настраиваете первого администратора, добавьте этот UUID в таблицу site_admins через Supabase SQL Editor. Для передачи доступа действующий администратор может добавить UUID нового владельца в разделе «Администраторы».
          </p>
          <pre className="admin-sql">insert into public.site_admins (user_id) values ('{session.user.id}');</pre>
          <button type="button" className="admin-secondary-button" onClick={() => refreshDashboard().catch((loadError) => setError(getErrorMessage(loadError)))} disabled={dashboardLoading}>
            Проверить права доступа
          </button>
          {error && <p className="admin-message admin-error" role="alert">{error}</p>}
          {notice && <p className="admin-message admin-success">{notice}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-dashboard">
        <div className="admin-topbar">
          <div>
            <a className="admin-back-link" href="/">← На сайт</a>
            <h1>Управление сайтом</h1>
            <p>{session.user.email}</p>
          </div>
          <button type="button" className="admin-secondary-button" onClick={handleSignOut} disabled={busy}>Выйти</button>
        </div>

        <nav className="admin-tabs" aria-label="Разделы панели">
          <button className={activeTab === "teachers" ? "active" : ""} onClick={() => setActiveTab("teachers")}>Преподаватели</button>
          <button className={activeTab === "certificates" ? "active" : ""} onClick={() => setActiveTab("certificates")}>Сертификаты</button>
          <button className={activeTab === "admins" ? "active" : ""} onClick={() => setActiveTab("admins")}>Администраторы</button>
        </nav>

        {error && <p className="admin-message admin-error" role="alert">{error}</p>}
        {notice && <p className="admin-message admin-success">{notice}</p>}
        {dashboardLoading && <p className="admin-loading">Обновляем данные...</p>}

        {activeTab === "teachers" && (
          <div className="admin-content">
            <form className="admin-form admin-editor" onSubmit={saveTeacher}>
              <h2>{editingTeacherId ? "Редактировать преподавателя" : "Добавить преподавателя"}</h2>
              <div className="admin-form-grid">
                <label>
                  Имя учителя
                  <input value={teacherDraft.name} onChange={(event) => setTeacherDraft({ ...teacherDraft, name: event.target.value })} required />
                </label>
                <label>
                  Стаж работы
                  <input value={teacherDraft.experience} onChange={(event) => setTeacherDraft({ ...teacherDraft, experience: event.target.value })} required />
                </label>
                <label className="field-wide">
                  Специализация
                  <input value={teacherDraft.specialty} onChange={(event) => setTeacherDraft({ ...teacherDraft, specialty: event.target.value })} required />
                </label>
                <label className="field-wide">
                  Описание
                  <textarea rows="4" value={teacherDraft.description} onChange={(event) => { setTeacherDraft({ ...teacherDraft, description: event.target.value }); autoResizeTextarea(event); }} />
                </label>
                <label className="field-wide">
                  Фото преподавателя (JPG, PNG, WEBP или GIF, до 5 МБ)
                  <input key={teacherFileKey} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setTeacherFile(event.target.files?.[0] || null)} />
                </label>
              </div>
              {teacherDraft.photoPath && (
                <img className="admin-image-preview" src={getMediaUrl(teacherDraft.photoPath)} alt="Текущее фото преподавателя" />
              )}
              <div className="admin-form-actions">
                <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Сохраняем..." : editingTeacherId ? "Сохранить изменения" : "Добавить преподавателя"}</button>
                {editingTeacherId && <button type="button" className="admin-secondary-button" onClick={resetTeacherForm}>Отмена</button>}
              </div>
            </form>

            <div className="admin-record-list">
              {teachers.length === 0 ? <p className="admin-empty">Преподавателей пока нет.</p> : teachers.map((teacher) => (
                <article className="admin-record" key={teacher.id}>
                  {teacher.photo_path && <img src={getMediaUrl(teacher.photo_path)} alt="" />}
                  <div className="admin-record-info">
                    <h3>{teacher.name}</h3>
                    <p>{teacher.specialty} · {teacher.experience}</p>
                    {teacher.description && <p>{teacher.description}</p>}
                    <span className={teacher.published ? "admin-status published" : "admin-status"}>
                      {teacher.published ? "Опубликован" : "Черновик"}
                    </span>
                  </div>
                  <div className="admin-record-actions">
                    <button type="button" className="admin-secondary-button" onClick={() => editTeacher(teacher)}>Изменить</button>
                    <button type="button" className="admin-publish-button" onClick={() => togglePublished("teachers", teacher)} disabled={busy}>{teacher.published ? "Снять публикацию" : "Опубликовать"}</button>
                    <button type="button" className="admin-delete-button" onClick={() => deleteContent("teachers", teacher)} disabled={busy}>Удалить</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="admin-content">
            <form className="admin-form admin-editor" onSubmit={saveCertificate}>
              <h2>{editingCertificateId ? "Редактировать сертификат" : "Добавить сертификат"}</h2>
              <div className="admin-form-grid">
                <label className="field-wide">
                  Описание сертификата
                  <textarea rows="4" value={certificateDraft.description} onChange={(event) => { setCertificateDraft({ ...certificateDraft, description: event.target.value }); autoResizeTextarea(event); }} />
                </label>
                <label className="field-wide">
                  Фото сертификата (JPG, PNG, WEBP или GIF, до 5 МБ)
                  <input key={certificateFileKey} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setCertificateFile(event.target.files?.[0] || null)} />
                </label>
              </div>
              {certificateDraft.photoPath && (
                <img className="admin-image-preview" src={getMediaUrl(certificateDraft.photoPath)} alt="Текущий сертификат" />
              )}
              <div className="admin-form-actions">
                <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Сохраняем..." : editingCertificateId ? "Сохранить изменения" : "Добавить сертификат"}</button>
                {editingCertificateId && <button type="button" className="admin-secondary-button" onClick={resetCertificateForm}>Отмена</button>}
              </div>
            </form>

            <div className="admin-record-list">
              {certificates.length === 0 ? <p className="admin-empty">Сертификатов пока нет.</p> : certificates.map((certificate) => (
                <article className="admin-record" key={certificate.id}>
                  <img src={getMediaUrl(certificate.photo_path)} alt="" />
                  <div className="admin-record-info">
                    <p>{certificate.description || "Описание не добавлено."}</p>
                    <span className={certificate.published ? "admin-status published" : "admin-status"}>
                      {certificate.published ? "Опубликован" : "Черновик"}
                    </span>
                  </div>
                  <div className="admin-record-actions">
                    <button type="button" className="admin-secondary-button" onClick={() => editCertificate(certificate)}>Изменить</button>
                    <button type="button" className="admin-publish-button" onClick={() => togglePublished("certificates", certificate)} disabled={busy}>{certificate.published ? "Снять публикацию" : "Опубликовать"}</button>
                    <button type="button" className="admin-delete-button" onClick={() => deleteContent("certificates", certificate)} disabled={busy}>Удалить</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "admins" && (
          <div className="admin-content">
            <div className="admin-editor">
              <h2>Передать или снять права администратора</h2>
              <p className="admin-help">
                Новый владелец должен создать личный аккаунт через /admin и подтвердить email. Добавьте UUID его аккаунта ниже. После проверки доступа новый владелец сможет снять права с предыдущего администратора. Не удаляйте последнего администратора.
              </p>
              <form className="admin-add-user" onSubmit={addAdministrator}>
                <label>
                  UUID аккаунта нового администратора
                  <input value={adminUserId} onChange={(event) => setAdminUserId(event.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" required />
                </label>
                <button type="submit" className="btn-primary" disabled={busy}>Назначить администратором</button>
              </form>
            </div>

            <div className="admin-record-list">
              {admins.map((admin) => (
                <article className="admin-record admin-member" key={admin.user_id}>
                  <div className="admin-record-info">
                    <h3>{admin.user_id === session.user.id ? "Ваш аккаунт" : "Администратор"}</h3>
                    <code>{admin.user_id}</code>
                  </div>
                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() => removeAdministrator(admin.user_id)}
                    disabled={busy || admin.user_id === session.user.id}
                  >
                    {admin.user_id === session.user.id ? "Текущий аккаунт" : "Снять права"}
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
