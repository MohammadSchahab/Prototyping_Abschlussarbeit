import { MongoClient, ObjectId } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

const client = new MongoClient(MONGODB_URI);

await client.connect();
const db = client.db("Hula"); // select database

/**
 * ==========================================
 * SERVICE CRUD-FUNKTIONEN
 * ==========================================
 */

/**
 * Alle Services aus der Datenbank abrufen
 */
export async function getAllServices() {
  let services = [];
  try {
    const collection = db.collection("service"); // ✅ Richtig: kleingeschrieben
    
    // Einfache Abfrage ohne Filter
    const query = {};
    
    // Services nach Kategorie sortieren
    const sortOptions = { category: 1, title: 1 };
    
    // Alle passenden Dokumente abrufen und als Array zurückgeben
    services = await collection.find(query).sort(sortOptions).toArray();
    
    // ObjectIds in Strings umwandeln, damit sie in JSON serialisiert werden können
    services.forEach((service) => {
      service._id = service._id.toString();
    });
    
    console.log(`${services.length} Services erfolgreich abgerufen`);
  } catch (error) {
    console.error("Fehler beim Abrufen der Services:", error);
  }
  
  return services;
}

/**
 * Alias für Kompatibilität
 */
export const getServices = getAllServices;

/**
 * Einen einzelnen Service anhand seiner ID abrufen
 */
export async function getService(id) {
  let service = null;
  try {
    const collection = db.collection("service"); // ✅ Richtig: kleingeschrieben
    
    // Nach ID filtern
    const query = { _id: new ObjectId(id) };
    
    // Service abrufen
    service = await collection.findOne(query);
    
    if (!service) {
      console.log(`Kein Service mit ID ${id} gefunden`);
      return null;
    }
    
    // ObjectId in String umwandeln
    service._id = service._id.toString();
    
    console.log(`Service ${service.title} erfolgreich abgerufen`);
  } catch (error) {
    console.error(`Fehler beim Abrufen des Service mit ID ${id}:`, error);
  }
  
  return service;
}

/**
 * Einen neuen Service erstellen
 */
export async function createService(service) {
  try {
    // Standardwerte setzen
    service.createdAt = new Date();
    
    // Wenn kein Bild angegeben ist, Platzhalter verwenden
    if (!service.imageUrl) {
      service.imageUrl = "https://via.placeholder.com/400x300/6c757d/ffffff?text=Service";
    }
    
    const collection = db.collection("service");
    const result = await collection.insertOne(service);
    
    console.log(`Neuer Service erstellt mit ID: ${result.insertedId}`);
    return result.insertedId.toString();
  } catch (error) {
    console.error("Fehler beim Erstellen des Service:", error);
    return null;
  }
}

/**
 * Einen Service löschen
 */
export async function deleteService(id) {
  try {
    const collection = db.collection("service"); 
    const query = { _id: new ObjectId(id) };
    
    const result = await collection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      console.log(`Kein Service mit ID ${id} gefunden`);
      return null;
    }
    
    console.log(`Service mit ID ${id} wurde gelöscht`);
    return id;
  } catch (error) {
    console.error(`Fehler beim Löschen des Service mit ID ${id}:`, error);
    return null;
  }
}

/**
 * Alle Kategorien abrufen (distinct)
 */
export async function getCategories() {
  try {
    const collection = db.collection("service"); 
    const categories = await collection.distinct("category");
    return categories;
  } catch (error) {
    console.error("Fehler beim Abrufen der Kategorien:", error);
    return [];
  }
}

/**
 * ==========================================
 * SERVICEREQUEST CRUD-FUNKTIONEN
 * ==========================================
 */

/**
 * ServiceRequest in MongoDB "Hula" Collection "serviceRequest" erstellen
 */
export async function createServiceRequest(serviceRequestData) {
    try {
        const collection = db.collection('serviceRequest'); 
        
        // ServiceRequest mit automatisch gesetzten Feldern erstellen
        const serviceRequest = {
            ...serviceRequestData,
            _id: new ObjectId(),
            // Automatisch gesetzte Felder:
            status: 'new',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await collection.insertOne(serviceRequest);
        
        console.log(`✅ ServiceRequest erfolgreich in "serviceRequest" Collection gespeichert: ${result.insertedId}`);
        
        return {
            ...serviceRequest,
            _id: result.insertedId
        };
    } catch (error) {
        console.error('❌ Fehler beim Erstellen der ServiceRequest:', error);
        throw error;
    }
}