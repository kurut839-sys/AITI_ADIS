
export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <h2 className="footer-logo brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></h2>
        <p>Образование, которое открывает возможности.</p>
      </div>

      <div>
        <h3>Наши контакты</h3>
        <a href="https://wa.me/996558553177" target="_blank" rel="noreferrer">
          +996 558 553 177
        </a>
        <p>Бишкек, проспект Чынгыза Айтматова, 421</p>
      </div>

      <div className="footer-bottom">
        © 2026 <span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span>. Все права защищены.
      </div>
    </footer>
  );
}
