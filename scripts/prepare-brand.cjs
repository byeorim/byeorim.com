const fs=require('fs');
const pathModule=require('path');
const sharp=require(process.env.SHARP_MODULE || 'sharp');
process.chdir(pathModule.resolve(__dirname, '..'));
(async()=>{
fs.mkdirSync('public/assets', {recursive:true});
for (const [source, target] of [
  ['mark.svg', 'assets/byeorim.svg'],
  ['mark-white.svg', 'assets/byeorim-white.svg'],
  ['favicon.svg', 'favicon.svg'],
  ['favicon-32.png', 'favicon-32.png'],
  ['profile-dark.png', 'assets/byeorim-profile.png'],
]) fs.copyFileSync('brand/byeorim/'+source, 'public/'+target);
const mark=fs.readFileSync('brand/byeorim/mark-white.svg','utf8');
const path=mark.match(/ d="([^"]+)"/)[1];
const og=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#a44636"/><svg x="740" y="95" width="420" height="420" viewBox="0 0 1024 1024"><path fill="#fbfbfa" fill-rule="evenodd" d="${path}"/></svg><g fill="#fbfbfa" font-family="Arial,sans-serif"><text x="90" y="292" font-size="96" font-weight="600" letter-spacing="-4">ByeoRim</text><text x="96" y="352" font-size="24" letter-spacing="5">APPS &amp; GAMES</text><text x="96" y="538" font-size="20">byeorim.com</text></g></svg>`;
await sharp(Buffer.from(og)).png().toFile('public/assets/og-image.png');
await sharp('brand/byeorim/profile-dark.png').resize(180).png().toFile('public/apple-touch-icon.png');
})().catch(error=>{ console.error(error); process.exitCode=1; });
