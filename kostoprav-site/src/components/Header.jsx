
const links = [
  ["Главная", "home"],
  ["Курсы", "courses"],
  ["Преподаватели", "teachers"],
  ["Сертификаты", "certificates"],
  ["Контакты", "contacts"],
];

export default function Header({ page, setPage }) {
  return (
    <header className="header">
      <button className="logo" onClick={() => setPage("home")}>
        <div className="logo-circle">
          <img src="/images/logo.png" alt="Логотип IT ADIS" />
        </div>
        <div>
          <h2 className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></h2>
        </div>
      </button>

      <nav className="navigation">
        {links.map(([name, id]) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={page === id ? "nav-link active" : "nav-link"}
          >
            {name}
          </button>
        ))}
      </nav>

      <a
        className="header-contact"
        href="https://wa.me/996558553177?text=Здравствуйте!%20Хочу%20узнать%20о%20курсах%20IT%20ADIS"
        target="_blank"
        rel="noreferrer"
      >
        Связаться ↗
      </a>
    </header>
  );
}
