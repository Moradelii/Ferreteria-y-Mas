/**
 * Storage and Image utilities for Ferretería y Maderas La Ceiba
 * Prevents LocalStorage QuotaExceededError and normalizes web paths.
 */

/**
 * Normalizes an image path or URL:
 * - Replaces Windows backslashes (\) with forward slashes (/)
 * - Removes 'public/' or 'public\' prefix since Vite serves public assets from root '/'
 * - Ensures leading slash for local relative paths
 * - Preserves http://, https://, and data:image/ URLs
 */
export function sanitizeImagePath(input: string): string {
  if (!input) return '';
  let trimmed = input.trim().replace(/^["']|["']$/g, '');

  // If it's already an absolute web URL or a base64 data URI, return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Replace Windows backslashes with web forward slashes
  let sanitized = trimmed.replace(/\\+/g, '/');

  // Strip leading 'public/' or './public/' or '/public/'
  sanitized = sanitized.replace(/^(\.\/)?\/?public\//i, '/');

  // Strip leading './'
  sanitized = sanitized.replace(/^\.\//, '/');

  // Ensure leading slash if not present
  if (!sanitized.startsWith('/')) {
    sanitized = '/' + sanitized;
  }

  // Remove duplicate slashes
  sanitized = sanitized.replace(/\/+/g, '/');

  return sanitized;
}

/**
 * Resizes and compresses an uploaded image file using HTML5 Canvas.
 * Produces a lightweight Base64 JPEG/WebP string (~30KB to 70KB)
 * that will NEVER exceed localStorage's 5MB quota limit.
 */
export async function compressImageFile(file: File, maxDim = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen válida.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo decodificar la imagen.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scale
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original if canvas context unavailable
          resolve(e.target?.result as string);
          return;
        }

        // Fill background with white in case of transparent PNG to avoid black background on jpeg
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with 82% quality (excellent quality, small footprint ~40KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Safely retrieves and parses a JSON item from localStorage.
 * If data is corrupted or parsing fails, returns fallback and deletes bad key.
 */
export function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch (error) {
    console.warn(`[StorageHelper] Error parsing key "${key}". Restoring defaults to avoid crash:`, error);
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return fallback;
  }
}

/**
 * Safely saves data to localStorage.
 * Gracefully handles QuotaExceededError so the application NEVER crashes or turns white.
 */
export function safeSetStorage<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error: any) {
    console.warn(`[StorageHelper] Failed to save key "${key}" to localStorage:`, error);

    // If quota exceeded, attempt cleanup of non-critical items
    if (
      error &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22 ||
        error.code === 1014)
    ) {
      console.warn('[StorageHelper] LocalStorage Quota Exceeded. Attempting emergency recovery...');
      try {
        // Try clearing auxiliary cached items like completed orders or quotes
        localStorage.removeItem('fym_quotes');
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        console.error('[StorageHelper] Unable to save item even after clearing auxiliary cache.');
      }
    }
    return false;
  }
}

/**
 * Complete reset of application storage in case of critical corruption.
 */
export function resetAppStorage(): void {
  try {
    localStorage.removeItem('fym_products');
    localStorage.removeItem('fym_cart');
    localStorage.removeItem('fym_orders');
    localStorage.removeItem('fym_quotes');
    localStorage.removeItem('fym_zones');
    localStorage.removeItem('fym_config');
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
}
