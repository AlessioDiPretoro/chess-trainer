import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, "node_modules", "stockfish", "bin");
const destDir = join(root, "public", "stockfish");

mkdirSync(destDir, { recursive: true });

for (const file of ["stockfish-19-lite-single.js", "stockfish-19-lite-single.wasm"]) {
  copyFileSync(join(srcDir, file), join(destDir, file));
}

console.log("Stockfish (lite-single) copiato in public/stockfish/");
