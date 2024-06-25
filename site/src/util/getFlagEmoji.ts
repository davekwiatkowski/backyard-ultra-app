export function getFlagEmoji(iso2: string) {
  if (!iso2) {
    return '';
  }
  const codePoints = iso2
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
