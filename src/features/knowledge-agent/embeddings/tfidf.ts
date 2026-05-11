const VECTOR_DIM = 512;

const STOP_WORDS = new Set([
  // Turkish
  "ve", "veya", "ile", "bir", "bu", "şu", "da", "de", "ki", "mi",
  "mı", "mu", "mü", "için", "olan", "gibi", "kadar", "daha", "çok",
  "az", "var", "yok", "ben", "sen", "biz", "siz", "onlar", "çünkü",
  "ama", "fakat", "ancak", "hem", "ya", "ne", "nasıl", "neden",
  // English
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
  "for", "of", "is", "are", "was", "be", "that", "this", "it",
  "with", "as", "by", "from", "not", "have", "has", "had", "do",
  "does", "did", "will", "would", "could", "should", "may", "can",
  "its", "their", "your", "our", "we", "you", "they", "he", "she",
  "if", "so", "then", "than", "when", "which", "who", "what", "how",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9ğüşıöçğüşıöç]+/i)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function hashToken(token: string): number {
  let h = 5381;
  for (let i = 0; i < token.length; i++) {
    h = (((h << 5) + h) ^ token.charCodeAt(i)) >>> 0;
  }
  return h % VECTOR_DIM;
}

export function embed(text: string): number[] {
  const tokens = tokenize(text);
  const vec = new Array<number>(VECTOR_DIM).fill(0);
  for (const token of tokens) {
    vec[hashToken(token)] += 1;
  }
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  if (mag === 0) return vec;
  return vec.map((v) => v / mag);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) dot += a[i] * b[i];
  return dot;
}
