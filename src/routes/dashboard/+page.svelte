
<script>
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";

    // Props: Daten vom Server
    let { data, form } = $props();
    
    // State-Variablen
    let services = $state(data.services || []);
    let showServiceForm = $state(false);
    
    // Formular-Handler
    function handleFormSubmit() {
        return async ({ update }) => {
            await update();
            showServiceForm = false;
            await invalidateAll();
        };
    }

    // Bestätigungsdialog für Löschen
    function confirmDelete() {
        return confirm("Service wirklich löschen?");
    }
</script>

<svelte:head>
    <title>Admin Dashboard | HULA technische Hilfe</title>
</svelte:head>

<div class="container py-4">
    <div class="d-flex align-items-center mb-4">
        <h1>Admin Dashboard</h1>
    </div>

    <!-- Services verwalten Überschrift -->
    <div class="mb-4">
        <h2>Services verwalten</h2>
        {#if !showServiceForm}
            <button class="btn btn-primary my-3" onclick={() => (showServiceForm = true)}>
                <i class="bi bi-plus-circle me-2"></i>Neuen Service anlegen
            </button>
        {/if}
    </div>

    <!-- Meldungen -->
    {#if form?.success}
        <div class="alert alert-success">
            <i class="bi bi-check-circle me-2"></i>{form.message}
        </div>
    {/if}
    {#if form?.error}
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>{form.error}
        </div>
    {/if}

    <!-- Service-Formular -->
    {#if showServiceForm}
        <div class="card mb-4">
            <div class="card-header">
                <h3 class="h5 mb-0">Neuen Service anlegen</h3>
            </div>
            <div class="card-body">
                <form method="POST" action="?/createService" use:enhance={handleFormSubmit}>
                    <div class="mb-3">
                        <label for="title" class="form-label">Titel *</label>
                        <input type="text" class="form-control" id="title" name="title" required />
                    </div>

                    <div class="mb-3">
                        <label for="category" class="form-label">Kategorie *</label>
                        <select class="form-select" id="category" name="category" required>
                            <option value="">-- Bitte wählen --</option>
                            <option value="Abholung und Lieferung">Abholung und Lieferung</option>
                            <option value="Datenübertragung">Datenübertragung</option>
                            <option value="Installation und Einrichtung">Installation und Einrichtung</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label">Beschreibung</label>
                        <textarea class="form-control" id="description" name="description" rows="2"></textarea>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="price" class="form-label">Preis (CHF)</label>
                            <input type="number" class="form-control" id="price" name="price" step="0.01" min="0" />
                            <small class="text-muted">Leer lassen für "Auf Anfrage"</small>
                        </div>
                        <div class="col-md-6">
                            <label for="priceUnit" class="form-label">Preiseinheit</label>
                            <select class="form-select" id="priceUnit" name="priceUnit">
                                <option value="flat">Pauschal</option>
                                <option value="hour">Pro Stunde</option>
                            </select>
                        </div>
                    </div>

                    <!-- Dauer in Minuten  -->
                    <div class="mb-3">
                        <label for="durationMin" class="form-label">Dauer (Minuten)</label>
                        <input type="number" class="form-control" id="durationMin" name="durationMin" min="0" />
                        <small class="text-muted">Ungefähre Dauer des Services</small>
                    </div>

                    <div class="d-flex justify-content-between mt-3">
                        <button type="button" class="btn btn-outline-secondary" onclick={() => (showServiceForm = false)}>
                            Abbrechen
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-plus-circle me-2"></i>Service erstellen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <!-- Services-Tabelle -->
    {#if services.length === 0}
        <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>Keine Services vorhanden. Erstellen Sie Ihren ersten Service!
        </div>
    {:else}
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Servicename</th>
                    <th class="text-end">Aktionen</th>
                </tr>
            </thead>
            <tbody>
                {#each services as service}
                    <tr>
                        <td>{service.title}</td>
                        <td class="text-end">
                            <form method="POST" action="?/deleteService" use:enhance={handleFormSubmit}>
                                <input type="hidden" name="serviceId" value={service._id} />
                                <button
                                    class="btn btn-sm btn-outline-danger"
                                    type="button"
                                    onclick={(e) => {
                                        if (confirmDelete()) {
                                            e.target.closest("form").submit();
                                        }
                                    }}
                                >
                                    <i class="bi bi-trash me-1"></i>Löschen
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</div>