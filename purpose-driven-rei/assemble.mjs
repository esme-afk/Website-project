import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync('src.html','utf8');
// shared head = everything up to and including the FIRST </style> (fonts marker + design-system CSS + placeholder CSS)
const idx = src.indexOf('</style>');
if(idx<0) throw new Error('no </style> in src.html');
const head = src.slice(0, idx + '</style>'.length);

function assemble(bodyFile, outFile){
  const body = readFileSync(bodyFile,'utf8');
  const out = head + '\n\n' + body;
  writeFileSync(outFile, out);
  console.log('assembled', outFile, out.length, 'chars; fonts:', out.includes('/*__INLINE_FONTS__*/'), '; gsap:', out.includes('<!--__GSAP__-->'));
}
assemble('mission_body.html', 'mission.src.html');
assemble('invest_body.html', 'invest.src.html');
