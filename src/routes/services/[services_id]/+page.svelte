<script>
import { enhance } from '$app/forms';

// Grundlegende Daten aus dem Server
let { data, form } = $props();
let service = $state(data.service);
let isSubmitting = $state(false); // Status für den Submit-Button

// Formatieren des Preises für die Anzeige
function formatPrice(price) {
    if (!price || !price.amount) return "Preis auf Anfrage";
    
    let amount = price.amount;
    let unit = price.unit || "flat";
    const unitLabel = {
        hour: "pro Stunde",
        flat: "Pauschal",
    }[unit] || "";
    
    return `${amount.toFixed(2).replace(".", ",")} ${price.currency || "CHF"} ${unitLabel}`;
}

// Icons und Farben für die verschiedenen Kategorien
const categoryIcons = {
    'Abholung und Lieferung': 'bi-truck',
    'Datenübertragung': 'bi-database-fill-gear',
    'Installation und Einrichtung': 'bi-gear-fill',
    'default': 'bi-tools' // Fallback-Icon
};

const categoryColors = {
    'Abholung und Lieferung': 'bg-info bg-opacity-10',
    'Datenübertragung': 'bg-warning bg-opacity-10',
    'Installation und Einrichtung': 'bg-success bg-opacity-10',
    'default': 'bg-primary bg-opacity-10' // Fallback-Farbe
};

// Hilfsfunktionen zum Abrufen der Icons und Farben
function getCategoryIcon(category) {
    return categoryIcons[category] || categoryIcons.default;
}

function getCategoryColor(category) {
    return categoryColors[category] || categoryColors.default;
}

// Heutiges Datum für die Datumsauswahl
const today = new Date().toISOString().split('T')[0];
</script>

<!-- Hier können wir auf SEO-relevante Tags verzichten -->
<svelte:head>
    <title>{service.title} | HULA Techhilfe</title>
</svelte:head>

<div class="container">
    <!-- Zurück-Button -->
    <a href="/services" class="btn btn-outline-secondary mb-4">
        &larr; Zurück zur Übersicht
    </a>

    <div class="row">
        <!-- LINKE SPALTE: Service-Icon und Details -->
        <div class="col-lg-5 mb-4 mb-lg-0">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body p-4">
                    <!-- Icon und Kategorie -->
                    <div class="d-flex justify-content-between align-items-start mb-4">
                        <div class="service-icon-container {getCategoryColor(service.category)}" style="width: 80px; height: 80px;">
                            <i class="bi {getCategoryIcon(service.category)} fs-1"></i>
                        </div>
                        <span class="badge bg-primary rounded-pill px-3 py-2">
                            {service.category}
                        </span>
                    </div>
                    
                    <!-- Service-Details mit Icons -->
                    <div class="mt-4">
                        <!-- Dauer -->
                        <div class="d-flex align-items-center mb-3">
                            <i class="bi bi-clock me-3 text-primary fs-4"></i>
                            <div>
                                <h3 class="h5 mb-0">Dauer</h3>
                                <p class="mb-0">{service.durationMin ? `Ca. ${service.durationMin} Minuten` : "Variabel"}</p>
                            </div>
                        </div>
                        
                        <!-- Ort -->
                        <div class="d-flex align-items-center mb-3">
                            <i class="bi bi-geo-alt me-3 text-primary fs-4"></i>
                            <div>
                                <h3 class="h5 mb-0">Ort</h3>
                                <p class="mb-0">Bei Ihnen vor Ort</p>
                            </div>
                        </div>
                        
                        <!-- Verfügbarkeit -->
                        <div class="d-flex align-items-center">
                            <i class="bi bi-calendar-check me-3 text-primary fs-4"></i>
                            <div>
                                <h3 class="h5 mb-0">Verfügbarkeit</h3>
                                <p class="mb-0">Montag - Freitag, 8:00 - 18:00 Uhr</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Buchen-Button -->
                    <div class="mt-4 pt-4 border-top">
                        <a href="#booking-section" class="btn btn-lg btn-primary w-100">
                            <i class="bi bi-calendar-plus me-2"></i>
                            Jetzt buchen
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- RECHTE SPALTE: Service-Beschreibung -->
        <div class="col-lg-7">
            <h1 class="mb-3">{service.title}</h1>
            <p class="lead mb-4">
                {service.description}
            </p>

            <!-- Preis -->
            <div class="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom">
                <div>
                    <h2 class="h4 mb-1">Preis</h2>
                    <p class="display-6 fw-bold text-primary mb-0">
                        {service.price ? formatPrice(service.price) : "Preis auf Anfrage"}
                    </p>
                </div>
            </div>

            <!-- Was wir tun - Liste -->
            <div class="mb-4">
                <h3 class="h5 mb-3">Was wir für Sie tun</h3>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item bg-transparent px-0">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        Professionelle Beratung und Umsetzung
                    </li>
                    <li class="list-group-item bg-transparent px-0">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        Schnelle und zuverlässige Service-Ausführung
                    </li>
                    <li class="list-group-item bg-transparent px-0">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        Transparente Preise ohne versteckte Kosten
                    </li>
                    <li class="list-group-item bg-transparent px-0">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        Flexibel nach Ihren Bedürfnissen
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- BUCHUNGSFORMULAR -->
    <div class="row mt-5" id="booking-section">
        <div class="col-12">
            <div class="card shadow">
                <div class="card-header bg-primary text-white">
                    <h3 class="h4 mb-0">
                        <i class="bi bi-calendar-check me-2"></i>
                        "{service.title}" jetzt buchen
                    </h3>
                </div>
                <div class="card-body p-4">
                    <!-- Formular mit enhance Direktive für bessere Benutzererfahrung -->
                    <form 
                        method="POST" 
                        use:enhance={() => {
                            isSubmitting = true;
                            return async ({ update }) => {
                                await update();
                                isSubmitting = false;
                            };
                        }}
                    >
                        <!-- Versteckte Service-Informationen -->
                        <input type="hidden" name="serviceId" value={service._id} />
                        <input type="hidden" name="requestedService" value={service.title} />

                        <div class="row">
                            <!-- Kontaktdaten -->
                            <div class="col-md-6">
                                <h5 class="mb-3 text-primary">Ihre Kontaktdaten</h5>
                                
                                <div class="mb-3">
                                    <label for="customerName" class="form-label">Name *</label>
                                    <input 
                                        type="text" 
                                        id="customerName" 
                                        name="customerName" 
                                        class="form-control {form?.errors?.customerName ? 'is-invalid' : ''}"
                                        value={form?.formData?.customerName || ''}
                                        required
                                    />
                                    {#if form?.errors?.customerName}
                                        <div class="invalid-feedback">{form.errors.customerName}</div>
                                    {/if}
                                </div>

                                <div class="mb-3">
                                    <label for="customerEmail" class="form-label">E-Mail *</label>
                                    <input 
                                        type="email" 
                                        id="customerEmail" 
                                        name="customerEmail" 
                                        class="form-control {form?.errors?.customerEmail ? 'is-invalid' : ''}"
                                        value={form?.formData?.customerEmail || ''}
                                        required
                                    />
                                    {#if form?.errors?.customerEmail}
                                        <div class="invalid-feedback">{form.errors.customerEmail}</div>
                                    {/if}
                                </div>

                                <div class="mb-3">
                                    <label for="customerPhone" class="form-label">Telefon *</label>
                                    <input 
                                        type="tel" 
                                        id="customerPhone" 
                                        name="customerPhone" 
                                        class="form-control {form?.errors?.customerPhone ? 'is-invalid' : ''}"
                                        value={form?.formData?.customerPhone || ''}
                                        placeholder="+41 XX XXX XX XX"
                                        required
                                    />
                                    {#if form?.errors?.customerPhone}
                                        <div class="invalid-feedback">{form.errors.customerPhone}</div>
                                    {/if}
                                </div>
                            </div>

                            <!-- Adresse und Termin -->
                            <div class="col-md-6">
                                <h5 class="mb-3 text-primary">Service-Adresse & Termin</h5>
                                
                                <div class="mb-3">
                                    <label for="street" class="form-label">Adresse *</label>
                                    <input 
                                        type="text" 
                                        id="street" 
                                        name="street" 
                                        class="form-control {form?.errors?.street ? 'is-invalid' : ''}"
                                        value={form?.formData?.address?.street || ''}
                                        placeholder="Straße und Hausnummer"
                                        required
                                    />
                                    {#if form?.errors?.street}
                                        <div class="invalid-feedback">{form.errors.street}</div>
                                    {/if}
                                </div>

                                <div class="row mb-3">
                                    <div class="col-4">
                                        <label for="postalCode" class="form-label">PLZ *</label>
                                        <input 
                                            type="text" 
                                            id="postalCode" 
                                            name="postalCode" 
                                            class="form-control {form?.errors?.postalCode ? 'is-invalid' : ''}"
                                            value={form?.formData?.address?.postalCode || ''}
                                            maxlength="4"
                                            placeholder="8001"
                                            inputmode="numeric"
                                            required
                                        />
                                        {#if form?.errors?.postalCode}
                                            <div class="invalid-feedback">{form.errors.postalCode}</div>
                                        {/if}
                                    </div>
                                    <div class="col-8">
                                        <label for="city" class="form-label">Ort *</label>
                                        <input 
                                            type="text" 
                                            id="city" 
                                            name="city" 
                                            class="form-control {form?.errors?.city ? 'is-invalid' : ''}"
                                            value={form?.formData?.address?.city || ''}
                                            required
                                        />
                                        {#if form?.errors?.city}
                                            <div class="invalid-feedback">{form.errors.city}</div>
                                        {/if}
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="preferredDate" class="form-label">Datum *</label>
                                        <input 
                                            type="date" 
                                            id="preferredDate" 
                                            name="preferredDate" 
                                            class="form-control {form?.errors?.preferredDate ? 'is-invalid' : ''}"
                                            value={form?.formData?.preferredDate || ''}
                                            min={today}
                                            required
                                        />
                                        {#if form?.errors?.preferredDate}
                                            <div class="invalid-feedback">{form.errors.preferredDate}</div>
                                        {/if}
                                    </div>
                                    <div class="col-md-6">
                                        <label for="preferredTime" class="form-label">Uhrzeit</label>
                                        <select 
                                            id="preferredTime" 
                                            name="preferredTime" 
                                            class="form-select"
                                            value={form?.formData?.preferredTime || ''}
                                        >
                                            <option value="">-- Flexible --</option>
                                            <option value="08:00">8:00 - 9:00</option>
                                            <option value="09:00">9:00 - 10:00</option>
                                            <option value="10:00">10:00 - 11:00</option>
                                            <option value="11:00">11:00 - 12:00</option>
                                            <option value="13:00">13:00 - 14:00</option>
                                            <option value="14:00">14:00 - 15:00</option>
                                            <option value="15:00">15:00 - 16:00</option>
                                            <option value="16:00">16:00 - 17:00</option>
                                            <option value="17:00">17:00 - 18:00</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Notizen -->
                        <div class="mb-4">
                            <label for="notes" class="form-label">Zusätzliche Informationen</label>
                            <textarea 
                                id="notes" 
                                name="notes" 
                                class="form-control" 
                                rows="2"
                                value={form?.formData?.notes || ''}
                                placeholder="Besondere Wünsche oder Details zum Problem..."
                            ></textarea>
                        </div>

                        <!-- Fehlermeldung -->
                        {#if form?.errors?.general}
                            <div class="alert alert-danger" role="alert">
                                <i class="bi bi-exclamation-triangle me-2"></i>
                                {form.errors.general}
                            </div>
                        {/if}

                        <!-- Submit Button mit Ladezustand -->
                        <div class="d-flex justify-content-end">
                            <button 
                                type="submit" 
                                class="btn btn-primary btn-lg px-4"
                                disabled={isSubmitting}
                            >
                                {#if isSubmitting}
                                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Wird gesendet...
                                {:else}
                                    <i class="bi bi-calendar-check me-2"></i>
                                    Jetzt buchen
                                {/if}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Styling für das Service-Icon -->
<style>
    .service-icon-container {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bs-primary);
    }
</style>