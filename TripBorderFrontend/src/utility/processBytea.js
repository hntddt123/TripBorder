// Convert byte array to base64 without btoa
const arrayToBase64 = (byteArray) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes = new Uint8Array(byteArray); // Ensure it’s a Uint8Array
  let result = '';
  let i = 0;

  // Process 3 bytes at a time into 4 base64 chars
  while (i < bytes.length) {
    const b1 = bytes[i] || 0;
    const b2 = bytes[i + 1] || 0;
    const b3 = bytes[i + 2] || 0;

    const octet1 = b1 >> 2;
    const octet2 = ((b1 & 3) << 4) | (b2 >> 4);
    const octet3 = ((b2 & 15) << 2) | (b3 >> 6);
    const octet4 = b3 & 63;

    result += chars[octet1] + chars[octet2]
      + (i + 1 < bytes.length ? chars[octet3] : '=')
      + (i + 2 < bytes.length ? chars[octet4] : '=');

    i += 3;
  }

  return result;
};

const detectImageFormat = (bytes) => {
  // Check first 12 bytes
  const arr = new Uint8Array(bytes.slice(0, 12));

  // JPG: Starts with 0xFFD8
  if (arr[0] === 0xFF && arr[1] === 0xD8) {
    return 'image/jpeg';
  }

  // PNG: Starts with 0x89504E47
  if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47) {
    return 'image/png';
  }

  // HEIC: Look for 'ftypheic' or related HEIF signatures (bytes 4-11)
  const ftyp = String.fromCharCode(...arr.slice(4, 8));
  if (ftyp === 'ftyp' && ['heic', 'heix', 'mif1'].includes(String.fromCharCode(...arr.slice(8, 12)))) {
    return 'image/heic';
  }

  // Unknown format
  return null;
};

export function processBytea(bytea) {
  const base64String = arrayToBase64(bytea.data);
  const mimeType = detectImageFormat(bytea.data);

  if (!mimeType) {
    throw new Error('Unsupported image format');
  }

  return `data:${mimeType};base64,${base64String}`;
}
