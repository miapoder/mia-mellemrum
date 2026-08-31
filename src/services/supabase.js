const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

async function getEvents() {
  const response = await fetch(
    `${SUPABASE_URL}/events?select=*,venues(*)&order=date.asc`,
    { headers },
  );

  return response.json();
}

async function getEvent(eventId) {
  const response = await fetch(
    `${SUPABASE_URL}/events?id=eq.${eventId}&select=*,venues(*)`,
    { headers },
  );

  if (!response.ok) {
    throw new Error("Kunne ikke hente eventet.");
  }

  const data = await response.json();

  return data[0];
}

async function checkRegistration(email, eventId) {
  const response = await fetch(
    `${SUPABASE_URL}/registrations?email=eq.${encodeURIComponent(
      email,
    )}&event_id=eq.${eventId}&select=id`,
    { headers },
  );

  if (!response.ok) {
    throw new Error("Kunne ikke kontrollere tilmeldingen.");
  }

  return response.json();
}

async function createRegistration(registration) {
  const response = await fetch(`${SUPABASE_URL}/registrations`, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "return=representation",
    },
    body: JSON.stringify(registration),
  });

  if (!response.ok) {
    throw new Error("Tilmeldingen kunne ikke gennemføres.");
  }

  return response.json();
}

async function getRegistrations() {
  const response = await fetch(
    `${SUPABASE_URL}/registrations?select=*,events(*)&order=createdAt.desc`,
    { headers },
  );

  return response.json();
}

export {
  getEvents,
  getEvent,
  checkRegistration,
  createRegistration,
  getRegistrations,
};
