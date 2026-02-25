/*
 * Temporary workaround for Vercel builder when using Next.js 16.
 * The build output no longer produces a standalone `middleware.js` file,
 * but Vercel's packager still expects a corresponding `.nft.json` trace.
 * This script creates an empty trace file after `next build` so the
 * deployment doesn't crash with ENOENT.
 */
const fs = require('fs');
const path = require('path');

const dest = path.join(process.cwd(), '.next', 'server', 'middleware.js.nft.json');

try {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify({}), 'utf8');
  console.log('✔ middleware stub created at', dest);
} catch (err) {
  console.error('Failed to create middleware stub:', err);
  process.exit(1);
}
