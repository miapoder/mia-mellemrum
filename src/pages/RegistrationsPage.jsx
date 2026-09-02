import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getRegistrations } from "../services/supabase";
import "../styles/RegistrationsPage.css";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRegistrations() {
      const data = await getRegistrations();
      setRegistrations(data);
      setRegistrationCount(data.length);
      setIsLoading(false);
    }

    loadRegistrations();
  }, []);

  if (isLoading) {
    return (
      <main className="loading-page">
        <div className="loading-content">
          <p className="eyebrow dark">Indlæser</p>
          <h1>Henter tilmeldinger</h1>
        </div>
      </main>
    );
  }

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        <div className="registration-list">
          <div className="registration-row registration-labels">
            <span>Navn</span>
            <span>Event</span>
            <span>Dato</span>
            <span>Status</span>
          </div>
          {registrations.map((registration) => (
            <div className="registration-row" key={registration.id}>
              <div>
                <strong>{registration.name}</strong>
                <small>{registration.email}</small>
              </div>
              <span>{registration.events?.title || "Ukendt event"}</span>
              <span>
                {registration.events?.date
                  ? new Date(registration.events.date).toLocaleDateString(
                      "da-DK",
                    )
                  : "Ukendt dato"}
              </span>
              <span
                className={`status status-${registration.status.toLowerCase()}`}
              >
                {registration.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
