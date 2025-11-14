export function formatAddress({ address, province, ward, district }) {
  return [address, ward, district, province].filter(Boolean).join(", ");
}
