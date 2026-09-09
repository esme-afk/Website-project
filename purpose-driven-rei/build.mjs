import { readFileSync, writeFileSync } from 'node:fs';

const SP = new URL('.', import.meta.url).pathname;
const fonts = readFileSync(SP + 'fonts/inline-fonts.css', 'utf8');
const gsap = readFileSync(SP + 'node_modules/gsap/dist/gsap.min.js', 'utf8');
const st = readFileSync(SP + 'node_modules/gsap/dist/ScrollTrigger.min.js', 'utf8');

function build(src, placeholders) {
  // NOTE: use replacement FUNCTIONS so `$&`, `$'`, `$\`` etc. in the minified
  // library source are inserted literally (string replacements would treat them
  // as special patterns and corrupt the code).
  return src
    .replace('/*__INLINE_FONTS__*/', () => fonts)
    .replace('<!--__GSAP__-->', () => '<script>' + gsap + '</script>')
    .replace('<!--__SCROLLTRIGGER__-->', () => '<script>' + st + '</script>')
    .replace('/*__PLACEHOLDER_FLAG__*/ false', () => placeholders ? 'true' : 'false');
}

function emit(srcName, prodName, prevName) {
  const src = readFileSync(SP + srcName, 'utf8');
  writeFileSync(SP + prodName, build(src, false));
  writeFileSync(SP + prevName, build(src, true));
  console.log('built', prodName, '(prod) +', prevName, '(placeholders)');
}

emit('src.html', 'index.build.html', 'preview.html');
emit('mission.src.html', 'mission.build.html', 'mission.preview.html');
emit('invest.src.html', 'invest.build.html', 'invest.preview.html');
emit('community.src.html', 'community.build.html', 'community.preview.html');
emit('team.src.html', 'team.build.html', 'team.preview.html');
