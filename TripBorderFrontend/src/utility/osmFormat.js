export const getOSMAddress = (address) => ((address.house_number)
  ? `${address.house_number} ${address.road}`
  : `${address.road}`);
