
<script>
  //  hole die Prop "service" über $props()
  let { service } = $props();
  
  // formatPrice erwarte ein Objekt, das entweder
  //  • { amount: Number, currency: String, unit?: String }
  //  • { minAmount: Number, currency: String, unit?: String }
  // enthalten kann. Beispiele:
  //   { amount: 64, currency: 'CHF', unit: 'hour' }      "64,00 CHF/h"
  //   { minAmount: 84, currency: 'CHF', unit: 'hour' }   "ab 84,00 CHF/h"
  //   undefined oder ungültiges Objet                    "– CHF"
  const formatPrice = (price) => {
    // 1) Prüfen, ob price existiert:
    if (!price || typeof price !== 'object') {
      return '– CHF';
    }

    // 2) Ermitteln, ob fester amount (exact Price) oder nur minAmount:
    //    • Wenn amount eine Number ist, verwendee diese
    //    • Sonst, wenn minAmount eine Number ist, verwende  minAmount und kennzeichne mit "ab "
    let amt = null;
    let prefix = '';

    if (typeof price.amount === 'number') {
      amt = price.amount;
    } else if (typeof price.minAmount === 'number') {
      amt = price.minAmount;
      prefix = 'ab '; 
    }

    // 3) Falls weder amount noch minAmount eine Zahl ist
    if (amt === null) {
      return '– CHF';
    }

    // 4) Auf zwei Dezimalstellen runden und Dezimalpunkt -> Dezimalkomma:
    //    64           "64.00"  "64,00"
    const str = amt.toFixed(2).replace('.', ',');

    // 5) Währung anhängen (" CHF"):
    let result = `${prefix}${str} ${price.currency}`;

    // 6) Einheit (unit) behandeln:
    //    • Bei unit === "hour" -> "/h" anhängen
    //    • Bei unit === "flat" -> kein Suffix (Pauschalpreis)
    if (price.unit === 'hour') {
      result += '/h';
    }

    return result;
  };
  
  // Kurzbeschreibung auf eine bestimmte Länge kürzen
  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  // Funktion, um eine passende Icon-Klasse basierend auf der Kategorie zurückzugeben
  const getCategoryIcon = (category) => {
    // Map von Kategorien zu Bootstrap Icons
    const iconMap = {
      'Abholung und Lieferung': 'bi-truck',
      'Datenübertragung': 'bi-database-fill-gear',
      'Installation und Einrichtung': 'bi-gear-fill',
      'default': 'bi-tools' // Fallback-Icon
    };
    
    return iconMap[category] || iconMap.default;
  };

  // Funktion, um eine Hintergrundfarbe basierend auf der Kategorie zurückzugeben
  const getCategoryColor = (category) => {
    // Map von Kategorien zu CSS-Klassen für Farben
    //Bootstrap-Farben
    const colorMap = {
      'Abholung und Lieferung': 'bg-info bg-opacity-10',
      'Datenübertragung': 'bg-warning bg-opacity-10',
      'Installation und Einrichtung': 'bg-success bg-opacity-10',
      'default': 'bg-primary bg-opacity-10' // Fallback-Farbe
    };
    
    return colorMap[category] || colorMap.default;
  };
</script>

<a class="service-card-link text-decoration-none d-block h-100" href={`/services/${service._id}`}>
  <div class="card h-100 border-0 shadow-sm transition-hover">
    <div class="card-body d-flex flex-column h-100 p-4">
      <!-- Kategorie-Badge und Icon -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="service-icon-container {getCategoryColor(service.category)}">
          <i class="bi {getCategoryIcon(service.category)} fs-3"></i>
        </div>
        <span class="badge bg-primary rounded-pill px-3 py-2">{service.category}</span>
      </div>
      
      <!-- Titel und Beschreibung -->
      <h3 class="h5 card-title mb-2">{service.title}</h3>
      
      {#if service.description}
        <p class="card-text text-muted small mb-3">{truncateDescription(service.description)}</p>
      {/if}
      
      <!-- Preis und Details-Button -->
      <div class="mt-auto d-flex justify-content-between align-items-center">
        <span class="fw-bold fs-5 text-primary">{formatPrice(service.price)}</span>
        <button class="btn btn-sm btn-outline-primary rounded-pill">Details</button>
      </div>
    </div>
  </div>
</a>

<style>
  .transition-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .service-card-link:hover .transition-hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  }
  
  /* Service Icon Container Styling */
  .service-icon-container {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bs-primary);
    margin-bottom: 0.5rem;
  }
  
  /* Animation für den Button beim Hover */
  .btn-outline-primary {
    transition: all 0.2s ease;
  }
  
  .service-card-link:hover .btn-outline-primary {
    background-color: var(--bs-primary);
    color: white;
  }
</style>