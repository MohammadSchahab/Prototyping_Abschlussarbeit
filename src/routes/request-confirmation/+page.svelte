
<script>
  
</script>

<svelte:head>
  <title>Anfrage bestätigt | HULA technische Hilfe</title>
</svelte:head>

<div class="container py-5 text-center">
  <div class="card shadow-lg border-0 mx-auto" style="max-width: 600px;">
    <div class="card-body p-5">
      <!-- Erfolgssymbol und Überschrift -->
      <div class="mb-4">
        <div class="text-success mb-3">
          <i class="bi bi-check-circle-fill" style="font-size: 4rem;"></i>
        </div>
        <h1 class="text-success mb-3">Anfrage erfolgreich gesendet!</h1>
        <p class="lead">
          Vielen Dank für Ihre Service-Anfrage. Wir haben alle Details erhalten
          und werden uns innerhalb von 24 Stunden bei Ihnen melden.
        </p>
      </div>
      
      <!-- Was passiert als nächstes? -->
      <div class="mt-4 mb-4 text-start">
        <h5 class="text-primary mb-3">Was passiert als nächstes?</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item bg-transparent">
            <i class="bi bi-clipboard-check text-success me-2"></i>
            Wir prüfen Ihre Anfrage
          </li>
          <li class="list-group-item bg-transparent">
            <i class="bi bi-telephone text-success me-2"></i>
            Kontaktaufnahme innerhalb 24 Stunden
          </li>
          <li class="list-group-item bg-transparent">
            <i class="bi bi-calendar-check text-success me-2"></i>
            Terminvereinbarung für den Service
          </li>
        </ul>
      </div>
      
      <!-- Button zurück zu Services -->
      <div class="mt-5">
        <a href="/services" class="btn btn-primary">
          <i class="bi bi-arrow-left me-2"></i>
          Zurück zu allen Services
        </a>
      </div>
    </div>
  </div>
</div>