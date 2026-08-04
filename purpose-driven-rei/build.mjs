import { readFileSync, writeFileSync } from 'node:fs';

const SP = new URL('.', import.meta.url).pathname;
const src = readFileSync(SP + 'src.html', 'utf8');
const fonts = readFileSync(SP + 'fonts/inline-fonts.css', 'utf8');
const gsap = readFileSync(SP + 'node_modules/gsap/dist/gsap.min.js', 'utf8');
const st = readFileSync(SP + 'node_modules/gsap/dist/ScrollTrigger.min.js', 'utf8');

function build(placeholders) {
  // NOTE: use replacement FUNCTIONS so `$&`, `$'`, `$\`` etc. in the minified
  // library source are inserted literally (string replacements would treat them
  // as special patterns and corrupt the code).
  let out = src
    .replace('/*__INLINE_FONTS__*/', () => fonts)
    .replace('<!--__GSAP__-->', () => '<script>' + gsap + '</script>')
    .replace('<!--__SCROLLTRIGGER__-->', () => '<script>' + st + '</script>')
    .replace('/*__PLACEHOLDER_FLAG__*/ false', () => placeholders ? 'true' : 'false');
  return out;
}

writeFileSync(SP + 'index.build.html', build(false));
writeFileSync(SP + 'preview.html', build(true));
console.log('built index.build.html (prod) + preview.html (placeholders)');
