<script>
 import NavBar from '$lib/components/NavBar.svelte';
 import Footer from '$lib/components/Footer.svelte';
 let { children } = $props();
</script>

<!-- ======= Layout-Shell mit Flexbox für Sticky Footer ======= -->
<div class="d-flex flex-column min-vh-100">
  <NavBar />
  <main class="container py-5 flex-grow-1">
    <!-- Child-Pages werden hier gerendert -->
    {@render children()}
  </main>
  <Footer />
</div>

<style>
  
</style>