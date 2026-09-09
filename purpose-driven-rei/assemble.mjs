import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync('src.html','utf8');
const idx = src.indexOf('</style>');
if(idx<0) throw new Error('no </style> in src.html');
const head = src.slice(0, idx + '</style>'.length);
for(const [body,out] of [['mission_body.html','mission.src.html'],['invest_body.html','invest.src.html'],['community_body.html','community.src.html'],['team_body.html','team.src.html']]){
  const b = readFileSync(body,'utf8');
  const o = head + '\n\n' + b;
  writeFileSync(out, o);
  console.log('assembled', out, o.length, 'chars; fonts:', o.includes('/*__INLINE_FONTS__*/'), 'gsap:', o.includes('<!--__GSAP__-->'));
}
