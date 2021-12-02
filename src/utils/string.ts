/**
 * trans camelCase or PascalCase to keba-bize
 * @param str 
 * @returns 
 */
export const kebabize = (str: string) => {
  return str.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
      ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
      : letter;
  }).join('');
}

export const deleteRight = (str: string, right: string) => {
  if (str.endsWith(right)) {
    return str.substring(0, str.length - right.length)
  }
  return str;
}
