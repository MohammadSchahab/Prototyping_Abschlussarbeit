<script>
  // Vereinfachte Daten für die Service-Kategorien
  let serviceCategories = [
    {
      icon: 'bi-laptop',
      title: 'Computer & Laptop',
      description: 'Installation, Reparatur und Optimierung'
    },
    {
      icon: 'bi-wifi',
      title: 'Internet & WLAN',
      description: 'Einrichtung und Problemlösung'
    },
    {
      icon: 'bi-database-gear',
      title: 'Datenrettung',
      description: 'Wiederherstellung verlorener Daten'
    },
    {
      icon: 'bi-shield-check',
      title: 'Datensicherheit',
      description: 'Virenschutz und Datensicherung'
    }
  ];
</script>

<!-- Startsei  -->
<section class="hero-section py-5">
  <div class="container text-center">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h1 class="display-4 fw-bold mb-4">Technische Hilfe – schnell & unkompliziert</h1>
        <p class="lead mb-4">
          Von Internetanschluss bis Datenrettung – wir lösen dein technisches Problem, 
          damit du dich auf das Wesentliche konzentrieren kannst.
        </p>
        <a class="btn btn-primary btn-lg px-5 py-3" href="/services">
          <i class="bi bi-tools me-2"></i>
          Zu den Services
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Service-Kategorien mit symmetrischem Grid -->
<section class="services-section py-5 mt-5">
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <h2 class="mb-0">Unsere Services</h2>
      <a href="/services" class="btn btn-outline-primary px-4">
        Alle Services <i class="bi bi-arrow-right ms-2"></i>
      </a>
    </div>
    
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      {#each serviceCategories as category}
        <div class="col">
          <div class="service-card h-100">
            <div class="card-body p-4 text-center">
              <div class="service-icon mx-auto mb-3">
                <i class="bi {category.icon}"></i>
              </div>
              <h3 class="h5 mb-2">{category.title}</h3>
              <p class="small text-muted mb-3">{category.description}</p>
              <a href="/services" class="btn btn-sm btn-link text-primary p-0">
                Mehr erfahren <i class="bi bi-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  /*Styling für die gesamte Seite */
  section {
    margin-bottom: 2rem;
  }
  
  /* Service-Karten */
  .service-card {
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    transition: all 0.3s ease;
    background-color: white;
  }
  
  .service-card:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
    border-color: transparent;
  }
  
  .service-icon {
    width: 60px;
    height: 60px;
    background-color: rgba(var(--bs-primary-rgb), 0.1);
    color: var(--bs-primary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .service-icon i {
    font-size: 1.5rem;
  }
</style>