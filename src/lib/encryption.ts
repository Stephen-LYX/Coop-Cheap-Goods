/**
 * End-to-End Encryption Utility using Web Crypto API
 * 
 * This module provides secure message encryption/decryption using:
 * - AES-GCM (256-bit) for symmetric encryption
 * - PBKDF2 for key derivation from passwords
 * - Random IVs for each message
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM
const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 100000;

/**
 * Derives an encryption key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    importedKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generates a random salt
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Generates a random IV (Initialization Vector)
 */
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Encrypts a message using AES-GCM
 * 
 * @param message - The plain text message to encrypt
 * @param password - The password to derive the encryption key from
 * @returns Base64-encoded encrypted data with format: salt.iv.ciphertext
 */
export async function encryptMessage(message: string, password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const salt = generateSalt();
    const iv = generateIV();
    const key = await deriveKey(password, salt);

    const encryptedData = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv: new Uint8Array(iv) },
      key,
      data
    );

    // Combine salt, IV, and encrypted data
    const encryptedArray = new Uint8Array(encryptedData);
    const combinedArray = new Uint8Array(
      salt.length + iv.length + encryptedArray.length
    );
    combinedArray.set(new Uint8Array(salt), 0);
    combinedArray.set(new Uint8Array(iv), salt.length);
    combinedArray.set(encryptedArray, salt.length + iv.length);

    // Convert to base64 for storage
    return arrayBufferToBase64(combinedArray);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message');
  }
}

/**
 * Checks if a string appears to be encrypted (Base64 format with minimum length)
 */
export function isEncrypted(message: string): boolean {
  // Check minimum length first (faster)
  const minEncryptedLength = 60; // Approximate minimum for encrypted message
  if (message.length < minEncryptedLength) {
    return false;
  }
  
  // Check if it's a valid Base64 string
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!base64Regex.test(message)) {
    return false;
  }
  
  // Additional check: encrypted messages shouldn't have common plain text patterns
  // like spaces, lowercase common words, etc.
  if (message.includes(' ') || /^[a-z\s]+$/i.test(message.substring(0, 20))) {
    return false;
  }
  
  return true;
}

/**
 * Decrypts a message using AES-GCM
 * 
 * @param encryptedMessage - Base64-encoded encrypted data (salt.iv.ciphertext)
 * @param password - The password to derive the decryption key from
 * @returns The decrypted plain text message
 */
export async function decryptMessage(
  encryptedMessage: string,
  password: string
): Promise<string> {
  // Validate input
  if (!encryptedMessage || encryptedMessage.trim() === '') {
    return '';
  }

  // Quick check: if it doesn't look encrypted, return as-is
  if (!isEncrypted(encryptedMessage)) {
    return encryptedMessage;
  }

  try {
    const combinedArray = base64ToArrayBuffer(encryptedMessage);

    // Validate minimum length (salt + iv + at least some encrypted data)
    const minLength = SALT_LENGTH + IV_LENGTH + 16; // 16 bytes minimum for AES-GCM
    if (combinedArray.length < minLength) {
      // Data too small, return as plain text
      return encryptedMessage;
    }

    // Extract salt, IV, and encrypted data
    const salt = combinedArray.slice(0, SALT_LENGTH);
    const iv = combinedArray.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encryptedData = combinedArray.slice(SALT_LENGTH + IV_LENGTH);

    // Validate extracted components
    if (encryptedData.length === 0) {
      return encryptedMessage;
    }

    const key = await deriveKey(password, salt);

    // Create proper ArrayBuffer views for decryption
    const ivArray = new Uint8Array(iv);
    const encryptedArray = new Uint8Array(encryptedData);

    const decryptedData = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv: ivArray },
      key,
      encryptedArray
    );

    const decoder = new TextDecoder();
    const decrypted = decoder.decode(decryptedData);
    
    // Sanity check: if decrypted text has null bytes or looks corrupted, return original
    if (decrypted.includes('\0') || decrypted.length === 0) {
      return encryptedMessage;
    }
    
    return decrypted;
  } catch (error) {
    // If any error occurs during decryption, return the original message
    // This handles cases where the message looks like Base64 but isn't actually encrypted
    return encryptedMessage;
  }
}

/**
 * Converts ArrayBuffer to Base64 string using a safe encoding method
 */
function arrayBufferToBase64(buffer: Uint8Array): string {
  const chunks: string[] = [];
  const chunkSize = 0x8000; // Process in chunks to avoid call stack size exceeded
  
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = buffer.subarray(i, i + chunkSize);
    chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
  }
  
  return btoa(chunks.join(''));
}

/**
 * Converts Base64 string to Uint8Array using a safe decoding method
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes;
  } catch (error) {
    // Fallback: use manual base64 decoding if atob fails
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }
    
    const bufferLength = base64.length * 0.75;
    const bytes = new Uint8Array(bufferLength);
    let p = 0;
    
    for (let i = 0; i < base64.length; i += 4) {
      const encoded1 = lookup[base64.charCodeAt(i)];
      const encoded2 = lookup[base64.charCodeAt(i + 1)];
      const encoded3 = lookup[base64.charCodeAt(i + 2)];
      const encoded4 = lookup[base64.charCodeAt(i + 3)];
      
      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    
    return bytes;
  }
}

/**
 * Generates a cryptographically secure conversation key
 * This key should be shared securely between conversation participants
 */
export function generateConversationKey(): string {
  const keyArray = crypto.getRandomValues(new Uint8Array(32));
  return arrayBufferToBase64(keyArray);
}

/**
 * Hashes a string using SHA-256 (useful for generating deterministic keys)
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return arrayBufferToBase64(hashArray);
}
