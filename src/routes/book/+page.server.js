// src/routes/book/+page.server.js

import { createServiceRequest } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';

// Lädt nur leere Daten (kein Dropdown nötig)
export const load = async () => {
    console.log('📋 Book-Seite wird geladen...');
    return {};
};

export const actions = {
    default: async ({ request }) => {
        console.log('📝 Verarbeite Service-Anfrage...');
        const formData = await request.formData();

        // Formularfelder auslesen
        const serviceRequestData = {
            requestedService: formData.get('requestedService'),
            customerName:     formData.get('customerName'),
            customerEmail:    formData.get('customerEmail'),
            customerPhone:    formData.get('customerPhone'),
            preferredDate:    formData.get('preferredDate'),
            preferredTime:    formData.get('preferredTime'),
            notes:            formData.get('notes'),
            address: {
                street:     formData.get('street'),
                city:       formData.get('city'),
                postalCode: formData.get('postalCode')
            }
        };

        console.log('📦 Service:', serviceRequestData.requestedService,
                    'Kunde:', serviceRequestData.customerName);

        // Prüft Pflichtfelder
        const errors = validateServiceRequest(serviceRequestData);
        if (Object.keys(errors).length > 0) {
            console.log('❌ Validierungsfehler:', errors);
            return fail(400, {
                errors,
                formData: serviceRequestData
            });
        }

        try {
            // Speichert in der Datenbank
            const serviceRequest = await createServiceRequest(serviceRequestData);
            console.log('✅ Gespeichert:', serviceRequest._id);
            // Weiterleitung zur Bestätigungsseite
            throw redirect(303, `/request-confirmation?id=${serviceRequest._id}`);
        } catch (error) {
            if (error?.status === 303) throw error;
            console.error('❌ Speicher-Fehler:', error);
            return fail(500, {
                errors: { general: 'Fehler beim Speichern. Bitte erneut versuchen.' },
                formData: serviceRequestData
            });
        }
    }
};

// Validiert Eingaben kurz und knapp
function validateServiceRequest(data) {
    const errors = {};

    if (!data.requestedService || data.requestedService.trim().length < 3) {
        errors.requestedService = 'Min. 3 Zeichen nötig';
    }
    if (!data.customerName || data.customerName.length < 2) {
        errors.customerName = 'Min. 2 Zeichen nötig';
    }
    if (!data.customerEmail || !isValidEmail(data.customerEmail)) {
        errors.customerEmail = 'Ungültige E-Mail';
    }
    if (!data.customerPhone || data.customerPhone.length < 10) {
        errors.customerPhone = 'Ungültige Telefonnummer';
    }
    if (!data.preferredDate) {
        errors.preferredDate = 'Datum fehlt';
    }
    if (!data.address.street) {
        errors.street = 'Straße fehlt';
    }
    if (!data.address.city) {
        errors.city = 'Ort fehlt';
    }
    if (!data.address.postalCode || !/^\d{4}$/.test(data.address.postalCode)) {
        errors.postalCode = 'PLZ: 4 Ziffern nötig';
    }

    return errors;
}

// Einfache E-Mail-Überprüfung
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
