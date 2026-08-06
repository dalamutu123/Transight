export function maskAccountNumber(value: string): string {
  if (!value || value.length <= 6) {
    return '*'.repeat(value?.length ?? 0);
  }

  const first = value.slice(0, 3);
  const last = value.slice(-3);
  const middleLength = value.length - 6;

  return `${first}${'*'.repeat(middleLength)}${last}`;
}