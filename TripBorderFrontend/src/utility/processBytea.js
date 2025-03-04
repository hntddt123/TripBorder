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

export function processBytea(bytea) {
  return arrayToBase64(bytea.data);
}
