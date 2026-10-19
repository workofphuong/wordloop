// Typed-answer checking.
// Latin accents are stripped by default; kana dakuten (U+3099/309A) are left alone,
// so か and が stay different.

const collapse = (s) => s.normalize('NFC').trim().replace(/\s+/g, ' ');
// Letters with no accent to strip (ß, œ, đ ...) map to what a plain keyboard types.
const PLAIN = { 'ß': 'ss', 'œ': 'oe', 'æ': 'ae', 'ø': 'o', 'đ': 'd', 'ł': 'l' };
const stripLatinAccents = (s) =>
  s.normalize('NFD').replace(/([A-Za-z])[̀-ͯ]+/g, '$1').normalize('NFC').replace(/[ßœæøđł]/g, (c) => PLAIN[c]);

export function normalize(s, { strictAccents = false } = {}) {
  let out = collapse(String(s)).toLowerCase();
  if (!strictAccents) out = stripLatinAccents(out);
  return out;
}

function editDistanceAtMostOne(a, b) {
  const x = [...a];
  const y = [...b];
  if (Math.abs(x.length - y.length) > 1) return false;
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  if (x.length === y.length) {
    if (i === x.length) return true;
    if (x.slice(i + 1).join('') === y.slice(i + 1).join('')) return true; // substitution
    // swapped neighbours
    return x[i] === y[i + 1] && x[i + 1] === y[i] && x.slice(i + 2).join('') === y.slice(i + 2).join('');
  }
  const [long, short] = x.length > y.length ? [x, y] : [y, x];
  return long.slice(i + 1).join('') === short.slice(i).join('');
}

// Returns 'correct', 'almost' or 'wrong'.
export function checkAnswer(input, answer, { strictAccents = false } = {}) {
  const given = normalize(input, { strictAccents });
  const want = normalize(answer, { strictAccents });
  if (!given) return 'wrong';
  if (given === want) return 'correct';
  if (strictAccents && normalize(input) === normalize(answer)) return 'almost'; // accents only
  if ([...want].length >= 4 && editDistanceAtMostOne(given, want)) return 'almost';
  return 'wrong';
}
