
/**
 * Secure crypto utility using Web Crypto API (AES-GCM)
 * This avoids hardcoded keys and uses a generated key stored securely in IndexedDB.
 */

const DB_NAME = 'ramadan-med-secure-db';
const STORE_NAME = 'keys';
const KEY_NAME = 'encryption-key';

async function getKey(): Promise<CryptoKey> {
  if (typeof window === 'undefined') {
    throw new Error('Crypto is only available in the browser');
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(KEY_NAME);

      getRequest.onsuccess = async () => {
        if (getRequest.result) {
          resolve(getRequest.result);
        } else {
          // Generate a new key if one doesn't exist
          try {
            const newKey = await window.crypto.subtle.generateKey(
              {
                name: 'AES-GCM',
                length: 256,
              },
              true,
              ['encrypt', 'decrypt']
            );

            const putRequest = store.put(newKey, KEY_NAME);
            putRequest.onsuccess = () => resolve(newKey);
            putRequest.onerror = () => reject(new Error('Failed to store encryption key'));
          } catch (err) {
            reject(err);
          }
        }
      };

      getRequest.onerror = () => reject(new Error('Failed to retrieve encryption key'));
    };

    request.onerror = () => reject(new Error('Failed to open IndexedDB'));
  });
}

export async function encrypt(text: string): Promise<string> {
  try {
    const key = await getKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );

    // Concatenate IV and encrypted content
    const encryptedArray = new Uint8Array(iv.length + encryptedContent.byteLength);
    encryptedArray.set(iv);
    encryptedArray.set(new Uint8Array(encryptedContent), iv.length);

    // Convert to base64
    let binary = '';
    for (let i = 0; i < encryptedArray.byteLength; i++) {
      binary += String.fromCharCode(encryptedArray[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}

export async function decrypt(base64Data: string): Promise<string> {
  try {
    const binary = atob(base64Data);
    const encryptedArray = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      encryptedArray[i] = binary.charCodeAt(i);
    }

    const iv = encryptedArray.slice(0, 12);
    const data = encryptedArray.slice(12);
    const key = await getKey();

    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedContent);
  } catch (error) {
    // If decryption fails, we rethrow so the caller can decide to handle as plaintext
    throw error;
  }
}
