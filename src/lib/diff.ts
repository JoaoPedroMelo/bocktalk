export interface DiffPart {
  text: string;
  kind: 'same' | 'added' | 'removed';
}

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

/** Word-level diff (LCS) between the student's answer and the corrected sentence. */
export function wordDiff(from: string, to: string): DiffPart[] {
  const a = from.trim().split(/\s+/).filter(Boolean);
  const b = to.trim().split(/\s+/).filter(Boolean);
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = clean(a[i]) === clean(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const parts: DiffPart[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (clean(a[i]) === clean(b[j])) {
      parts.push({ text: b[j], kind: 'same' });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      parts.push({ text: a[i++], kind: 'removed' });
    } else {
      parts.push({ text: b[j++], kind: 'added' });
    }
  }
  while (i < a.length) parts.push({ text: a[i++], kind: 'removed' });
  while (j < b.length) parts.push({ text: b[j++], kind: 'added' });
  return parts;
}
