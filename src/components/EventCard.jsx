import { Link } from "react-router";

export default function EventCard({ event, formatEventDate }) {
  return (
    <Link className="event-card" to={`/events/${event.id}`}>
      <img src={event.image} alt="" />

      <div className="event-card-content">
        <p className="event-category">{event.category}</p>

        <h3>{event.title}</h3>

        <p>{event.summary}</p>

        <div className="event-meta">
          <span>{formatEventDate(event.date)}</span>
          <span>{event.venues?.name || "Ukendt sted"}</span>
        </div>

        <span className="card-link">Læs mere</span>
      </div>
    </Link>
  );
}
