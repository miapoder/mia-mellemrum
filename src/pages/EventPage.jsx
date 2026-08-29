import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function getEvent() {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/events?id=eq.${eventId}&select=*,venues(*)`,
          { headers },
        );

        if (!response.ok) {
          throw new Error("Kunne ikke hente eventet.");
        }

        const data = await response.json();
        setEvent(data[0]);
      } catch {
        setError(true);
      }
    }

    getEvent();
  }, [eventId, retry]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();

    if (!name.trim() || !email.trim()) {
      setStatus({
        type: "validation",
        message: "Udfyld venligst både navn og e-mail.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
  const existingResponse = await fetch(
    `${SUPABASE_URL}/registrations?email=eq.${encodeURIComponent(
      email.trim(),
    )}&event_id=eq.${eventId}&select=id`,
    { headers },
  );

  if (!existingResponse.ok) {
    throw new Error("Kunne ikke kontrollere tilmeldingen.");
  }

  const existingRegistrations = await existingResponse.json();

  if (existingRegistrations.length > 0) {
    setStatus({
      type: "error",
      message: "Du er allerede tilmeldt dette event.",
    });
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/registrations`, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name,
      email: email.trim(),
      status: "Ny",
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.venues?.name,
      event_id: eventId,
    }),
  });

  if (!response.ok) {
    throw new Error("Tilmeldingen kunne ikke gennemføres.");
  }

  await response.json();

  setStatus({
    type: "success",
    message: "Du er nu tilmeldt eventet.",
  });
  setName("");
  setEmail("");
} catch {
  setStatus({
    type: "error",
    message: "Der opstod en fejl. Prøv igen.",
  });
}

    finally {
      setIsSubmitting(false);
    }
  }

  if (error) {
    return (
      <main className="event-page error-page">
        <div className="error-content">
          <p className="eyebrow">Fejl</p>

          <h1>Eventet kunne ikke hentes</h1>

          <p>
            Der opstod en fejl, da eventet skulle hentes. Prøv igen, eller gå
            tilbage til alle events.
          </p>

          <div className="error-actions">
            <button
              type="button"
              onClick={() => {
                setError(false);
                setEvent(null);
                setRetry((value) => value + 1);
              }}
            >
              Prøv igen
            </button>

            <Link className="back-link" to="/">
              ← Tilbage til events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-page loading-page">
        <div className="loading-content">
          <p className="eyebrow">Indlæser</p>
          <h1>Henter event</h1>
        </div>
      </main>
    );
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <h1>{event.title}</h1>
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venues?.name}
                  <br />
                  {event.venues?.address}, {event.venues?.postalCode}{" "}
                  {event.venues?.city}
                  {event.venues?.website && (
                    <>
                      <br />
                      <a href={event.venues.website}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>
            <h2>Reserver din plads</h2>
            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
              />
            </label>
            <span>E-mail</span>
            <input
              value={email}
              onChange={(inputEvent) => setEmail(inputEvent.target.value)}
              placeholder="dig@example.com"
            />
            {status && (
              <p className={`signup-status ${status.type}`}>{status.message}</p>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Tilmelding..." : "Tilmeld mig"}
            </button>
          </form>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-brand">
              mellemrum<span>.</span>
            </p>
            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div className="footer-link-group">
              <p className="footer-heading">Udforsk</p>
              <Link to="/">Events</Link>
              <Link to="/om">Om Mellemrum</Link>
            </div>
            <div className="footer-link-group">
              <p className="footer-heading">For arrangører</p>
              <Link to="/tilmeldinger">Se tilmeldinger</Link>
              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">© 2025 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}
