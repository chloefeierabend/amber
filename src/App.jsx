import { useState } from "react";
import {
  searchByCity,
  searchByProvince as searchByState,
  searchNearby,
  BREWERY_TYPES,
} from "./services/breweryApi";
import BreweryCard from "./components/BreweryCard";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("city"); // 'city' or 'state'
  const [breweryType, setBreweryType] = useState("");
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      let results;
      if (searchType === "city") {
        results = await searchByCity(searchQuery, breweryType);
      } else {
        results = await searchByState(searchQuery, breweryType);
      }
      setBreweries(results);
    } catch (err) {
      setError("Failed to fetch breweries. Please try again.");
      setBreweries([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle "Near Me" button
  const handleNearMe = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchQuery("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const results = await searchNearby(latitude, longitude, breweryType);
          setBreweries(results);
        } catch (err) {
          setError("Failed to fetch nearby breweries. Please try again.");
          setBreweries([]);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError(
          "Unable to get your location. Please enable location services.",
        );
      },
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">Amber</h1>
        <p className="header__subtitle">Discover breweries near you</p>
      </header>

      <main className="main">
        <section className="search-section">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-form__row">
              <div className="search-form__input-group">
                <input
                  type="text"
                  className="search-form__input"
                  placeholder={`Enter a ${searchType}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="search-form__select"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="city">City</option>
                  <option value="state">State/Province</option>
                </select>
              </div>

              <button type="submit" className="search-form__button">
                Search
              </button>
            </div>

            <div className="search-form__row search-form__row--filters">
              <select
                className="search-form__select search-form__select--type"
                value={breweryType}
                onChange={(e) => setBreweryType(e.target.value)}
              >
                {BREWERY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="search-form__button search-form__button--secondary"
                onClick={handleNearMe}
              >
                Near Me
              </button>
            </div>
          </form>
        </section>

        <section className="results-section">
          {loading && (
            <div className="results__status">
              <p>Searching for breweries...</p>
            </div>
          )}

          {error && (
            <div className="results__status results__status--error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && hasSearched && breweries.length === 0 && (
            <div className="results__status">
              <p>No breweries found. Try a different search.</p>
            </div>
          )}

          {!loading && breweries.length > 0 && (
            <>
              <p className="results__count">
                Found {breweries.length}{" "}
                {breweries.length === 1 ? "brewery" : "breweries"}
              </p>
              <div className="results__grid">
                {breweries.map((brewery) => (
                  <BreweryCard key={brewery.id} brewery={brewery} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>
          Data provided by{" "}
          <a
            href="https://www.openbrewerydb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Brewery DB
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
