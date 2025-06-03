/* src/routes/services/[services_id]/+page.server.js */
import { getService, createServiceRequest } from '$lib/db';
import { error, fail, redirect } from '@sveltejs/kit';

/**
 * SvelteKit Server-Load-Funktion für die Service-Detailseite
 * 
 * Diese Funktion wird aufgerufen, wenn die Seite geladen wird.
 * Sie holt die Daten, die das Frontend benötigt, bevor die Seite gerendert wird.
 */
export const load = async ({ params }) => {
    // Extrahiere die Service-ID aus den URL-Parametern
    // z.B. /services/123 -> params.services_id = "123"
    const id = params.services_id;
    
    // Hole den Service mit dieser ID aus der Datenbank
    // Dies ist eine asynchrone Operation (daher das await)
    const service = await getService(id);
    
    // Fehlerbehandlung: Wenn kein Service gefunden wurde
    // Wirf einen 404-Fehler (Not Found), der von SvelteKit behandelt wird
    if (!service) {
        throw error(404, {
            message: 'Service nicht gefunden'
        });
    }
    
    // Gib den gefundenen Service an die +page.svelte-Komponente zurück
    // Diese Daten werden als prop.data an die Komponente übergeben
    return {
        service
    };
};

/**
 * SvelteKit Server-Actions für die Service-Detailseite
 * 
 * Actions werden aufgerufen, wenn ein Formular abgesendet wird.
 * Sie ermöglichen serverseitige Verarbeitung von Formulardaten.
 */
export const actions = {
    // Da wir keine action-Parameter im Formular haben (wie ?/action),
    // wird standardmässig die default-Action aufgerufen
    default: async ({ request, params }) => {
        // Extrahiere die Formulardaten aus dem Request
        // FormData ist eine Web-API zum Verarbeiten von Formulardaten
        const data = await request.formData();
        
        // Erstelle ein Objekt mit den Formulardaten
        // Dies ist die Struktur, die unsere Datenbank erwartet
        const serviceRequestData = {
            serviceId: data.get('serviceId'),
            requestedService: data.get('requestedService'),
            customerName: data.get('customerName'),
            customerEmail: data.get('customerEmail'),
            customerPhone: data.get('customerPhone'),
            preferredDate: data.get('preferredDate'),
            preferredTime: data.get('preferredTime'),
            notes: data.get('notes'),
            address: {
                street: data.get('street'),
                city: data.get('city'),
                postalCode: data.get('postalCode')
            }
        };
        
        // Validierung der Formulardaten auf dem Server
        // Dies ist wichtig, da Client-seitige Validierung umgangen werden kann
        const errors = {};
        
        // Überprüfe den Namen (mindestens 2 Zeichen)
        if (!serviceRequestData.customerName || serviceRequestData.customerName.length < 2) {
            errors.customerName = 'Name ist erforderlich (mindestens 2 Zeichen)';
        }
        
        // Überprüfe die E-Mail mit einer Hilfsfunktion (siehe unten)
        if (!serviceRequestData.customerEmail || !isValidEmail(serviceRequestData.customerEmail)) {
            errors.customerEmail = 'Gültige E-Mail-Adresse ist erforderlich';
        }
        
        // Überprüfe die Telefonnummer (mindestens 10 Zeichen)
        if (!serviceRequestData.customerPhone || serviceRequestData.customerPhone.length < 10) {
            errors.customerPhone = 'Gültige Telefonnummer ist erforderlich';
        }
        
        // Überprüfe das Datum
        if (!serviceRequestData.preferredDate) {
            errors.preferredDate = 'Bevorzugtes Datum ist erforderlich';
        }
        
        // Überprüfe die Adresse (Straße, Stadt, PLZ)
        if (!serviceRequestData.address.street) {
            errors.street = 'Straße ist erforderlich';
        }
        
        if (!serviceRequestData.address.city) {
            errors.city = 'Stadt ist erforderlich';
        }
        
        // PLZ-Validierung mit einem regulären Ausdruck (genau 4 Ziffern)
        if (!serviceRequestData.address.postalCode || !/^\d{4}$/.test(serviceRequestData.address.postalCode)) {
            errors.postalCode = 'Gültige Postleitzahl (4 Ziffern) ist erforderlich';
        }
        
        // Wenn Validierungsfehler vorhanden sind, gib sie zurück
        // fail(400) bedeutet "Bad Request" (Fehler bei der Anfrage)
        if (Object.keys(errors).length > 0) {
            return fail(400, {
                errors,              // Fehler für die Anzeige im Frontend
                formData: serviceRequestData  // Die eingegebenen Daten, damit der Benutzer sie nicht erneut eingeben muss
            });
        }
        
        // Wenn keine Validierungsfehler vorliegen, erstelle die Service-Anfrage in der Datenbank
        try {
            // Asynchroner Aufruf der Datenbankfunktion
            const serviceRequest = await createServiceRequest(serviceRequestData);
            
            // Log für Debugging-Zwecke
            console.log('ServiceRequest für spezifischen Service erstellt:', serviceRequest._id);
            
            // Nach erfolgreicher Erstellung Weiterleitung zur Bestätigungsseite
            // 303 bedeutet "See Other" (Weiterleitung nach POST)
            throw redirect(303, `/request-confirmation?id=${serviceRequest._id}`);
            
        } catch (error) {
            // Spezialfall: Wenn der Fehler eine Weiterleitung ist, leite weiter
            if (error?.status === 303) throw error;
            
            // Sonst protokolliere den Fehler und gib eine Fehlermeldung zurück
            console.error('Fehler beim Erstellen der Service-Anfrage:', error);
            
            // 500 bedeutet "Internal Server Error" (Serverfehler)
            return fail(500, {
                errors: { general: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
                formData: serviceRequestData
            });
        }
    }
};

/**
 * Hilfsfunktion zur E-Mail-Validierung mit einem regulären Ausdruck
 * 
 * Diese einfache Validierung prüft, ob die E-Mail-Adresse:
 * 1. Text vor dem @-Zeichen hat
 * 2. Ein @-Zeichen enthält
 * 3. Text nach dem @-Zeichen hat
 * 4. Einen Punkt nach dem @-Zeichen hat
 * 5. Text nach dem Punkt hat
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}