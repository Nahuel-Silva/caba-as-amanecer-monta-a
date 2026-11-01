/**
 * Decide si una reseña se publica sola o espera revisión. Solo mira insultos y enlaces:
 * las críticas se publican igual, por duras que sean. Por eso no hay palabras como "estafa" o "basura".
 */
const blockedWords = new Set([
  "boluda", "boludas", "boludo", "boludos", "cagada", "cagadas", "cagado", "cagon", "cagona", "cojudo",
  "concha", "culo", "culos", "forra", "forras", "forro", "forros", "garca", "garcas", "giles", "hdp",
  "maricon", "mogolico", "mogolica", "ojete", "orto", "pajera", "pajero", "pija", "poronga", "puta",
  "putas", "putita", "putito", "puto", "putos", "sorete", "soretes", "tarada", "tarado", "trola", "trolo",
  "verga", "asshole", "bitch", "fuck", "fucking", "motherfucker", "shit",
]);

/** Raíces que solo aparecen en insultos: cubren variantes como "pelotudez" o "mierdoso". */
const blockedPrefixes = ["conchud", "estupid", "hijodeput", "hijaput", "hijoput", "idiot", "imbecil", "mierd", "pelotud", "recontraput"];

const leetLetters: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s" };

const linkPattern = /https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ar|io|info|xyz)\b/i;

/** Deja cada palabra en minúsculas, sin tildes, sin letras repetidas de más y sin reemplazos como "put0". */
function normalizeWords(text: string) {
  const plain = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[013457@$]/g, (char) => leetLetters[char])
    .replace(/([aeiou])\1+/g, "$1")
    .replace(/([^aeiou])\1{2,}/g, "$1$1");

  // "p u t a" y "p.u.t.a" se vuelven a unir en una sola palabra.
  const tokens = plain.split(/[^a-zñ]+/).filter(Boolean);
  const words: string[] = [];
  let letters = "";
  for (const token of tokens) {
    if (token.length === 1) {
      letters += token;
      continue;
    }
    if (letters) words.push(letters);
    letters = "";
    words.push(token);
  }
  if (letters) words.push(letters);
  return words;
}

function hasBlockedWord(word: string) {
  return blockedWords.has(word) || blockedPrefixes.some((prefix) => word.startsWith(prefix));
}

export function needsReview(...texts: string[]) {
  const text = texts.join(" ");
  if (linkPattern.test(text)) return true;

  const words = normalizeWords(text);
  // "hijo de puta" ya entra por "puta"; también se revisan palabras separadas con guiones o puntos.
  return words.some(hasBlockedWord);
}
