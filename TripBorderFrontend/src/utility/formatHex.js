export async function formatHex(mileagePicture) {
  const arrayBuffer = await mileagePicture.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const hexString = Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return `\\x${hexString}`;
}
