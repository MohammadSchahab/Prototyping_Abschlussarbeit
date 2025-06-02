<script>
import { enhance } from '$app/forms';

// ===== PROPS UND STATE =====
// Daten aus dem Server und Formularstatus
let { data, form } = $props();
let isSubmitting = $state(false); // Wird auf true gesetzt, während das Formular abgesendet wird

// Services aus der Datenbank (falls vorhanden)
let existingServices = $state(data.existingServices || []);

// Reaktiver State für die Service-Beschreibung
let serviceDescription = $state('');

// Berechnung des heutigen Datums für das Mindestdatum des Datumfelds
// Format: "YYYY-MM-DD" (erforderlich für HTML date inputs)
const today = new Date().toISOString().split('T')[0];
</script>

<svelte:head>
    <title>Service anfragen | HULA Techhilfe</title>
</svelte:head>

<div class="container py-5">
    <!-- ===== HEADER-BEREICH ===== -->
    <div class="mb-4">
        <h1>Service anfragen</h1>
        <p class="lead">Beschreiben Sie Ihren gewünschten IT-Service.</p>
    </div>

    <div class="row">
        <!-- ===== HAUPTFORMULAR ===== -->
        <div class="col-lg-8">
            <div class="card shadow-sm">
                <div class="card-body p-4">
                    <!-- Formular mit "enhance"-Direktive für bessere Benutzererfahrung 
                         Diese Direktive verhindert vollständige Seitenneuladen beim Absenden -->
                    <form 
                        method="POST" 
                        use:enhance={() => {
                            // Vor dem Absenden: Status auf "wird gesendet" setzen
                            isSubmitting = true;
                            return async ({ update }) => {
                                // Nach Serverantwort: Update anwenden und Status zurücksetzen
                                await update();
                                isSubmitting = false;
                            };
                        }}
                    >
                        <!-- ===== SERVICE-BESCHREIBUNG ===== -->
                        <!-- Dieses Feld ist das wichtigste - der Benutzer beschreibt den gewünschten Service -->
                        <div class="mb-4">
                            <label for="requestedService" class="form-label">Gewünschter Service *</label>
                            <textarea 
                                id="requestedService"
                                name="requestedService" 
                                class="form-control {form?.errors?.requestedService ? 'is-invalid' : ''}"
                                rows="3"
                                placeholder="Beschreiben Sie den gewünschten IT-Service..."
                                bind:value={serviceDescription} 
                                required
                            ></textarea>
                            
                            <!-- Fehleranzeige für dieses Feld, falls vorhanden -->
                            {#if form?.errors?.requestedService}
                                <div class="invalid-feedback">{form.errors.requestedService}</div>
                            {/if}
                        </div>

                        <!-- ===== PERSÖNLICHE DATEN ===== -->
                        <h5 class="mb-3">Ihre Daten</h5>
                        
                        <!-- Zwei-spaltige Anordnung für Name und E-Mail -->
                        <div class="row mb-3">
                            <!-- Name -->
                            <div class="col-md-6">
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
                            
                            <!-- E-Mail -->
                            <div class="col-md-6">
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
                        </div>

                        <!-- Telefon -->
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

                        <!-- ===== ADRESSE ===== -->
                        <!-- Straße und Hausnummer -->
                        <div class="mb-3">
                            <label for="street" class="form-label">Adresse *</label>
                            <input 
                                type="text" 
                                id="street" 
                                name="street" 
                                class="form-control {form?.errors?.street ? 'is-invalid' : ''}"
                                value={form?.formData?.address?.street || ''}
                                required
                            />
                            {#if form?.errors?.street}
                                <div class="invalid-feedback">{form.errors.street}</div>
                            {/if}
                        </div>

                        <!-- PLZ und Ort als 2-spaltige Anordnung -->
                        <div class="row mb-3">
                            <!-- PLZ mit kleinerer Spalte -->
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
                                    required
                                />
                                {#if form?.errors?.postalCode}
                                    <div class="invalid-feedback">{form.errors.postalCode}</div>
                                {/if}
                            </div>
                            
                            <!-- Ort mit größerer Spalte -->
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

                        <!-- ===== TERMINWUNSCH ===== -->
                        <div class="row mb-3">
                            <!-- Datum -->
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
                            
                            <!-- Uhrzeit als Dropdown -->
                            <div class="col-md-6">
                                <label for="preferredTime" class="form-label">Uhrzeit</label>
                                <select 
                                    id="preferredTime" 
                                    name="preferredTime" 
                                    class="form-select"
                                    value={form?.formData?.preferredTime || ''}
                                >
                                    <option value="">Keine Präferenz</option>
                                    <option value="08:00">08:00 - 09:00</option>
                                    <option value="09:00">09:00 - 10:00</option>
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

                        <!-- ===== ZUSÄTZLICHE NOTIZEN ===== -->
                        <div class="mb-4">
                            <label for="notes" class="form-label">Zusätzliche Informationen</label>
                            <textarea 
                                id="notes" 
                                name="notes" 
                                class="form-control" 
                                rows="2"
                                value={form?.formData?.notes || ''}
                                placeholder="Besondere Wünsche oder Details..."
                            ></textarea>
                        </div>

                        <!-- ===== FEHLERMELDUNGEN ===== -->
                        <!-- Allgemeine Fehlermeldung (z.B. Serverfehler) -->
                        {#if form?.errors?.general}
                            <div class="alert alert-danger" role="alert">
                                <i class="bi bi-exclamation-triangle me-2"></i>
                                {form.errors.general}
                            </div>
                        {/if}

                        <!-- ===== BUTTONS ===== -->
                        <div class="d-flex justify-content-between align-items-center">
                            <!-- Zurück-Button -->
                            <a href="/services" class="btn btn-outline-secondary">
                                ← Zurück
                            </a>
                            
                            <!-- Submit-Button mit Ladeindikator -->
                            <button 
                                type="submit" 
                                class="btn btn-primary btn-lg"
                                disabled={isSubmitting}
                            >
                                {#if isSubmitting}
                                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Wird gesendet...
                                {:else}
                                    <!-- Standard-Button-Text -->
                                    <i class="bi bi-send me-2"></i>
                                    Anfrage absenden
                                {/if}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- ===== SIDEBAR MIT PROZESSERKLÄRUNG ===== -->
        <div class="col-lg-4">
            <div class="card shadow-sm">
                <div class="card-header">
                    <h5 class="mb-0">So funktioniert's</h5>
                </div>
                <div class="card-body">
                    <!-- Schritt 1: Service beschreiben -->
                    <div class="d-flex mb-3">
                        <span class="badge bg-primary rounded-circle me-2">1</span>
                        <div><strong>Service beschreiben</strong></div>
                    </div>
                    
                    <!-- Schritt 2: Anfrage senden -->
                    <div class="d-flex mb-3">
                        <span class="badge bg-primary rounded-circle me-2">2</span>
                        <div><strong>Anfrage senden</strong></div>
                    </div>
                    
                    <!-- Schritt 3: Angebot erhalten -->
                    <div class="d-flex mb-3">
                        <span class="badge bg-primary rounded-circle me-2">3</span>
                        <div><strong>Angebot erhalten</strong></div>
                    </div>
                    
                    <!-- Schritt 4: Termin vereinbaren -->
                    <div class="d-flex">
                        <span class="badge bg-primary rounded-circle me-2">4</span>
                        <div><strong>Termin vereinbaren</strong></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
