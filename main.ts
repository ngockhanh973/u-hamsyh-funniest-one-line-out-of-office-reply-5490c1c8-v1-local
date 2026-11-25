// Funniest One-Line Out-of-Office Reply — v1 (local)
// The entry is one constant: a single out-of-office line, 1-160 chars, one line.
// The program validates the gate itself, then writes the line byte-for-byte
// (no trailing newline, so the file holds exactly the reply) to entry.txt
// under the sandbox output directory, falling back to ./output when run locally.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I'm off until Friday — my auto-reply answers emails at $50 an hour, starting with this one.";

const MAX_CHARS = 160;

function charCount(text: string): number {
  return [...text].length;
}

function pickOutputDir(): string {
  const candidates = ["/output", join(process.cwd(), "output")];
  for (const dir of candidates) {
    try {
      mkdirSync(dir, { recursive: true });
      return dir;
    } catch {
      // Not writable here (e.g. a local run without /output) — try the next one.
    }
  }
  throw new Error("no writable output directory found");
}

function main(): void {
  const chars = charCount(LINE);
  if (LINE.trim().length === 0) {
    throw new Error("entry is blank");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, gate needs 1-${MAX_CHARS}`);
  }

  const outDir = pickOutputDir();
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  console.log(`wrote ${chars} characters to ${outPath}`);
  console.log(`entry: ${LINE}`);
}

main();
