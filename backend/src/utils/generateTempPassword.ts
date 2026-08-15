const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';

export function generateTempPassword(length = 12): string {
  let password = '';
  for (let i = 0; i < length; i++) {
    password += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  // Guarantee at least one of each required character class
  return `${password.slice(0, length - 3)}A1!`;
}