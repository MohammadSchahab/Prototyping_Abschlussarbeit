
import { getServices, createService, deleteService } from '$lib/db';
import { fail } from '@sveltejs/kit';

/**
 * Load-Funktion 
 */
export const load = async () => {
    try {
        // Nur Services aus der Datenbank laden
        const services = await getServices();
        
        // Daten an den Client zurückgeben
        return { 
            services
        };
    } catch (error) {
        console.error('Dashboard-Fehler:', error);
        // Leere Daten bei Fehler zurückgeben
        return {
            services: []
        };
    }
};

/**
 * Server Actions - nur für die Service-Verwaltung
 */
export const actions = {
    // Neuen Service erstellen
    createService: async ({ request }) => {
        const formData = await request.formData();
        
        // Service-Objekt aus Formulardaten erstellen
        const service = {
            title: formData.get('title'),
            description: formData.get('description') || '',
            category: formData.get('category'),
            price: {
                amount: formData.get('price') ? parseFloat(formData.get('price')) : null,
                currency: 'CHF',
                unit: formData.get('priceUnit') || 'flat'
            },
            durationMin: parseInt(formData.get('durationMin'), 10) || null
        };
        
        try {
            await createService(service);
            return { success: true, message: 'Service erfolgreich erstellt' };
        } catch (error) {
            return fail(500, { error: 'Fehler beim Erstellen des Services' });
        }
    },
    
    // Service löschen
    deleteService: async ({ request }) => {
        const formData = await request.formData();
        const serviceId = formData.get('serviceId');
        
        if (!serviceId) return fail(400, { error: 'Service-ID fehlt' });
        
        try {
            const result = await deleteService(serviceId);
            return result
                ? { success: true, message: 'Service erfolgreich gelöscht' }
                : fail(404, { error: 'Service nicht gefunden' });
        } catch (error) {
            return fail(500, { error: 'Fehler beim Löschen des Services' });
        }
    }
};