// Generate short unique IDs without dependencies.
// Format: prefix_xxxxxxxx (nanoid-style, alphabet restricted for URL safety)

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const LENGTH = 12;

export function generateId(prefix = 'id'): string {
  let id = '';
  const bytes = new Uint8Array(LENGTH);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < LENGTH; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `${prefix}_${id}`;
}
