import { writeFileSync } from 'node:fs';
import pngToIco from 'png-to-ico';

const buf = await pngToIco('public/vellure-logo.png');
writeFileSync('public/favicon.ico', buf);
console.log(`Wrote public/favicon.ico (${buf.length} bytes)`);
