export function pad(number:string|number, size = 2) {
  const s = `${'0'.repeat(size)}${number}`;
  return s.substring(s.length - size);
}
