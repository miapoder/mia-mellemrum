import { useEffect, useState } from "react";
import { Link } from "react-router";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json"
};

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getEvents() {
      const response = await fetch(
        `${SUPABASE_URL}/events?select=*,venues(*)&order=date.asc`,
        { headers },
      );
      const data = await response.json();
      setEvents(data);
      setIsLoading(false);
    }

    getEvents();
  }, []);

  const categories = [
    "Alle",
    ...new Set(events.map((event) => event.category)),
  ];

  const filteredEvents = events.filter((event) => {
    const searchText =
      `${event.title} ${event.summary} ${event.venues?.name || ""}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  function formatEventDate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  if (isLoading) {
    return (
      <main className="loading-page">
        <div className="loading-content">
          <p className="eyebrow dark">Indlæser</p>
          <h1>Henter events</h1>
        </div>
      </main>
    );
  }

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className="hero-copy">
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og
          tilmeld dig på få minutter.
        </p>
        <a className="hero-link" href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main id="events">
        <section className="section-heading">
          <div>
            <p className="eyebrow dark">Det sker</p>
            <h2>Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <EventFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />

        <section className="event-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              formatEventDate={formatEventDate}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
