
const whatsapp =
  "https://wa.me/996558553177?text=Здравствуйте!%20Хочу%20узнать%20подробнее%20о%20курсах%20IT%20ADIS";

const mapLink =
  "https://2gis.kg/bishkek/search/Чынгыз%20Айтматов%20проспекти%2C%20421";

export default function Contacts() {
  return (
    <main className="page-container">
      <div className="section-title page-title">
        <span>CONTACT US</span>
        <h1>Наши <span>контакты</span></h1>
        <p>Будем рады ответить на твои вопросы.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-panel">
          <h2>Давай начнём <span className="brand"><span className="brand-it">вместе</span><span className="brand-adis">!</span></span></h2>
          <p>Напиши нам, чтобы узнать подробнее об обучении.</p>

          <div className="contact-item">
            <span>☎</span>
            <div>
              <small>WHATSAPP / ТЕЛЕФОН</small>
              <a href="tel:+996558553177">+996 558 553 177</a>
            </div>
          </div>

          <div className="contact-item">
            <span>⌖</span>
            <div>
              <small>АДРЕС</small>
              <p>Бишкек, проспект Чынгыза Айтматова, 421</p>
            </div>
          </div>

          <a className="btn-primary" href={whatsapp} target="_blank" rel="noreferrer">
            Написать в WhatsApp ↗
          </a>

          <a className="btn-secondary map-button" href={mapLink} target="_blank" rel="noreferrer">
            Открыть в 2ГИС ↗
          </a>
        </div>

        <div className="map-panel">
          <div className="map-placeholder">
            <span>⌖</span>
            <h3><span className="brand"><span className="brand-it">IT</span><span className="brand-adis">adis</span></span></h3>
            <p>Проспект Чынгыза Айтматова, 421</p>
            <a href={mapLink} target="_blank" rel="noreferrer">
              Посмотреть на карте ↗
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
