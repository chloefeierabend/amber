import "./BreweryCard.css";

function BreweryCard({ brewery }) {
  const {
    name,
    brewery_type,
    street,
    city,
    state,
    postal_code,
    country,
    phone,
    website_url,
  } = brewery;

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;

    // CAD and US number formatting
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else {
      return phone; // Return as is if format is unrecognized
    }
  };

  const address = [street, city, state, postal_code, country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="brewery-card">
      <div className="brewery-card__header">
        <h3 className="brewery-card__name">{name}</h3>
        {brewery_type && (
          <span
            className={`brewery-card__type brewery-card__type--${brewery_type}`}
          >
            {brewery_type}
          </span>
        )}
      </div>

      {address && <p className="brewery-card__address">{address}</p>}

      {country && country !== "United States" && (
        <p className="brewery-card__coountry">{country}</p>
      )}

      <div className="brewery-card__footer">
        {phone && (
          <a href={`tel:${phone}`} className="brewery-card__link">
            {formatPhoneNumber(phone)}
          </a>
        )}
        {website_url && (
          <a
            href={website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="brewery-card__link"
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
}

export default BreweryCard;
