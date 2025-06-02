/* src/routes/services/+page.server.js */
import { getServices, getCategories } from '$lib/db';

/**
 * SvelteKit Server-Load-Funktion für die Services-Übersichtsseite
 * 
 * Lädt alle Services und Kategorien für die Anzeige und Filterung
 */
export const load = async ({ url }) => {
  // URL-Parameter für mögliche Filterung auslesen
  const categoryParam = url.searchParams.get('category');
  
  // Alle Services laden
  const services = await getServices();
  
  // Alle verfügbaren Kategorien laden (für Filter-UI)
  const categories = await getCategories();
  
  // Daten an die +page.svelte zurückgeben
  return {
    services,
    categories,
    activeCategory: categoryParam
  };
};