const BASE_URL = "https://api.openbrewerydb.org/v1/breweries";

export const BREWERY_TYPES = [
  { value: "", label: "All Types" },
  { value: "micro", label: "Micro" },
  { value: "nano", label: "Nano" },
  { value: "regional", label: "Regional" },
  { value: "brewpub", label: "Brewpub" },
  { value: "large", label: "Large" },
  { value: "planning", label: "Planning" },
  { value: "bar", label: "Bar" },
  { value: "contract", label: "Contract" },
  { value: "proprietor", label: "Proprietor" },
  { value: "closed", label: "Closed" },
];

//Search breweries by city and optional type
export async function searchByCity(city, type = "") {
  const params = new URLSearchParams({
    by_city: city.trim().replace(/\s+/g, "_"),
    per_page: "50",
  });

  if (type) {
    params.append("by_type", type);
  }

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error("Failed to fetch breweries");
  return response.json();
}

// Search breweries by province/state
export async function searchByProvince(province, type = "") {
  const params = new URLSearchParams({
    by_state: province.trim().replace(/\s+/g, "_"),
    per_page: "50",
  });

  if (type) {
    params.append("by_type", type);
  }

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error("Failed to fetch breweries");
  return response.json();
}

// Get breweries near coordinates
export async function searchNearby(latitude, longitude, type = "") {
  const params = new URLSearchParams({
    by_dist: `${latitude},${longitude}`,
    per_page: "20",
  });

  if (type) {
    params.append("by_type", type);
  }

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error("Failed to fetch breweries");
  return response.json();
}

// Basic search by name
export async function searchByName(name, type = "") {
  const params = new URLSearchParams({
    query: name.trim(),
    per_page: "50",
  });

  if (type) {
    params.append("by_type", type);
  }

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error("Failed to fetch breweries");
  return response.json();
}

// export async function fetchBreweriesByCity(city) {
//   const response = await fetch(`${BASE_URL}?by_city=${city}`);
//   const breweries = await response.json();
//   return breweries;
// }
