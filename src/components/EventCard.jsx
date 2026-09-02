import { Link } from "react-router";
import "../styles/EventCard.css";

export default function EventCard({
  event,
  formatEventDate,
  registrationCount,
}) {
  return (
    <Link className="event-card" to={`/events/${event.id}`}>
      <img src={event.image} alt="" loading="lazy" />

      <div className="event-card-content">
        <p className="event-category">{event.category}</p>

        <h3>{event.title}</h3>

        <p>{event.summary}</p>

        <div className="event-meta">
          <span>{formatEventDate(event.date)}</span>
          <span>{event.venues?.name || "Ukendt sted"}</span>
        </div>

        <div className="event-card-bottom">
          <span className="card-link">Læs mere</span>

          <span className="registration-count">
            {registrationCount} / {event.capacity} pladser
          </span>
        </div>
      </div>
    </Link>
  );
}
