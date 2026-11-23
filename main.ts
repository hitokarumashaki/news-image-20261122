// 22 Nov 2026 world news image entry (Node 22, standard library only).
// The entry ships a pre-rendered summary image, entry.png, and this
// program copies it into the harness output directory as entry.png.
// Copying a fixed file is deterministic and needs no network, so two
// runs always produce identical bytes.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const dest = join(outDir, 'entry.png');

if (!existsSync(source)) throw new Error('entry.png missing from repository');
mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);

// Confirm the copy landed as a PNG no bigger than 1 MiB.
const bytes = readFileSync(dest);
const magic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(magic)) throw new Error('output is not a PNG');
if (bytes.length > 1024 * 1024) throw new Error('output exceeds 1 MiB');
console.log(`wrote ${dest} (${bytes.length} bytes)`);
