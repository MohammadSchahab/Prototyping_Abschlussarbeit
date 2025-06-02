<script>
  import ServiceCard from '$lib/components/ServiceCard.svelte';
  
  let { data } = $props();
  let selectedCategory = $state(data.activeCategory || 'alle');
  
  let filteredServices = $derived(() => {
    if (!data.services) return [];
    return selectedCategory === 'alle'
      ? data.services
      : data.services.filter(service => service.category === selectedCategory);
  });
  
  function changeCategory(category) {
    selectedCategory = category;
    // URL-Parameter aktualisieren ohne Seiten-Neuladen
    const url = new URL(window.location);
    if (category === 'alle') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    history.pushState({}, '', url);
  }
</script>

<svelte:head>
  <title>Services | HULA technische Hilfe</title>
  <meta name="description" content="Technische Dienstleistungen von HULA - Installation, Einrichtung, Datenübertragung und mehr.">
</svelte:head>

<div class="container">
  <h1 class="display-5 fw-bold mb-4">Unsere Services</h1>
  
  <!-- Kategorie-Filter -->
  {#if data.categories && data.categories.length > 0}
    <div class="d-flex flex-wrap gap-2 mb-4">
      <button
        class="btn {selectedCategory === 'alle' ? 'btn-primary' : 'btn-outline-secondary'}"
        onclick={() => changeCategory('alle')}
      >
        Alle anzeigen
      </button>
      {#each data.categories as category}
        <button
          class="btn {selectedCategory === category ? 'btn-primary' : 'btn-outline-secondary'}"
          onclick={() => changeCategory(category)}
        >
          {category}
        </button>
      {/each}
    </div>
  {/if}
  
  <!-- Service-Karten -->
  {#if filteredServices().length > 0}
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {#each filteredServices() as service (service._id)}
        <div class="col">
          <ServiceCard {service} />
        </div>
      {/each}
    </div>
  {:else}
    <div class="alert alert-info">
      {data.services && data.services.length > 0 
        ? `Keine Services in der Kategorie "${selectedCategory}" gefunden.` 
        : 'Keine Services gefunden. Bitte stelle sicher, dass deine Datenbank Services enthält.'}
    </div>
  {/if}
</div>