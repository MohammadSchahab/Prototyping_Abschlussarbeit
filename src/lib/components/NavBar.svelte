<script>
 /*
 Sehr simples Offcanvas-Menü:
 - Store mit writable für reaktiven Boolean
 - Toggle nur für Kleingeräte; Bootstrap-Collapse spare ich mir,
 um JS-Payload klein zu halten. */
import { writable } from 'svelte/store';

// Store ohne $ im Variablennamen definieren
const isOpen = writable(false);

function toggle() {
  $isOpen = !$isOpen;
}
</script>

<nav class="navbar navbar-light bg-white border-bottom mb-4 shadow-sm">
  <div class="container d-flex justify-content-center position-relative">
    <!-- Logo + Titel (absolut links) -->
    <a
      href="/"
      class="navbar-brand position-absolute start-0 d-flex align-items-center"
      style="left: 0; /* stellt sicher, dass es ganz links bleibt */"
    >
      <img
        src="/logo.jpg"
        alt="HULA Logo"
        style="height: 40px; margin-right: 8px;"
      />
      <span class="fs-5 fw-bold">HULA</span>
    </a>
    <!-- Burger-Button -->
    <button class="btn btn-outline-secondary d-md-none position-absolute end-0" onclick={toggle} aria-label="Menü">
      ☰
    </button>
    <!-- Links – zentriert auf ≥ md, sonst Offcanvas -->
    <ul class="navbar-nav d-none d-md-flex flex-row">
      <li class="nav-item mx-3"><a class="nav-link" href="/dashboard">Dashboard</a></li>
      <li class="nav-item mx-3"><a class="nav-link" href="/book">Book / Service Anfragen</a></li>
      <li class="nav-item mx-3"><a class="nav-link" href="/services">Services</a></li>
    </ul>
  </div>
  
  {#if $isOpen}
  <!-- Offcanvas-Menu mobil -->
  <div class="position-fixed top-0 end-0 bg-white shadow p-4" style="width: 70%; height: 100vh;">
    <button class="btn-close float-end" onclick={toggle} aria-label="Schliessen" ></button>
    <ul class="navbar-nav mt-5 fs-5">
      <li class="nav-item mb-2"><a class="nav-link" href="/services">Services</a></li>
      <li class="nav-item mb-2"><a class="nav-link" href="/dashboard">Dashboard</a></li>
      <li class="nav-item mb-2"><a class="nav-link" href="/book">Book</a></li>
      <li class="nav-item mb-2"><a class="nav-link" href="/impressum">Impressum</a></li>
    </ul>
  </div>
  {/if}
</nav>

<style>
  /* kleiner Schatten für Offcanvas */
  .position-fixed {
    transition: transform 0.3s ease;
  }
</style>