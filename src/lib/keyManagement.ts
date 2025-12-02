/**
 * Encryption Key Management System
 * 
 * Manages encryption keys for conversations using IndexedDB for secure client-side storage.
 * Each conversation has a unique encryption key that is:
 * - Generated when a conversation is created
 * - Shared between conversation participants (via secure key exchange)
 * - Stored locally in IndexedDB
 * - Derived from the conversation ID for deterministic key generation
 */

const DB_NAME = 'CoopCheapGoodsEncryption';
const DB_VERSION = 1;
const STORE_NAME = 'conversationKeys';

interface ConversationKey {
  conversationId: string;
  key: string;
  createdAt: number;
}

/**
 * Opens or creates the IndexedDB database
 */
async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'conversationId' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

/**
 * Stores an encryption key for a conversation
 */
export async function storeConversationKey(
  conversationId: string,
  key: string
): Promise<void> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const data: ConversationKey = {
      conversationId,
      key,
      createdAt: Date.now(),
    };
    
    const request = store.put(data);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Retrieves an encryption key for a conversation
 */
export async function getConversationKey(conversationId: string): Promise<string | null> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(conversationId);
    
    request.onsuccess = () => {
      const result = request.result as ConversationKey | undefined;
      resolve(result?.key || null);
    };
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Generates or retrieves a conversation key
 * - If key exists in IndexedDB, returns it
 * - If not, generates a new deterministic key from conversation ID and user IDs
 */
export async function ensureConversationKey(
  conversationId: string,
  userId: string,
  otherUserId: string
): Promise<string> {
  // Check if key already exists
  const existingKey = await getConversationKey(conversationId);
  if (existingKey) {
    return existingKey;
  }

  // Generate deterministic key from conversation participants
  // Sort user IDs to ensure same key regardless of who creates conversation
  const sortedUsers = [userId, otherUserId].sort();
  const keySource = `${conversationId}:${sortedUsers[0]}:${sortedUsers[1]}`;
  
  // Use SHA-256 hash as the encryption password
  const encoder = new TextEncoder();
  const data = encoder.encode(keySource);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const key = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Store the key
  await storeConversationKey(conversationId, key);
  
  return key;
}

/**
 * Deletes a conversation key (for privacy/security)
 */
export async function deleteConversationKey(conversationId: string): Promise<void> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(conversationId);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Clears all stored conversation keys (for logout or privacy)
 */
export async function clearAllKeys(): Promise<void> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Lists all stored conversation keys (for debugging)
 */
export async function listAllKeys(): Promise<ConversationKey[]> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result as ConversationKey[]);
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}
