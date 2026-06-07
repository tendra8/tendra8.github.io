const https = require('https');
const fs = require('fs');

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const jkt = await fetchHtml('https://buanaraya.com/tarif-kirim-asal-jakarta/');
  
  // Extract lists from jkt HTML
  // In the markdown it was:
  // ### Tujuan
  // - AMBON
  // ...
  // So it's probably <li>AMBON</li>
  const rows = [];
  const liRegex = /<li>(.*?)<\/li>/gi;
  let match;
  let count = 0;
  while ((match = liRegex.exec(jkt)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim().toUpperCase();
    if (text.length > 2 && text !== 'CALL / WA' && !text.includes('BERLAKU VOLUMETRIK')) {
      if (!rows.includes(text)) {
        rows.push(text);
      }
    }
  }
  
  // Clean up non-cities
  const jktCities = rows.filter(r => r.length < 25 && !r.includes('TENTANG KAMI') && !r.includes('LAYANAN') && !r.includes('BANDUNG') && !r.includes('TARIF') && !r.includes('BILA BERAT PAKET'));

  fs.writeFileSync('jkt_cities.json', JSON.stringify(jktCities, null, 2));
  console.log('Jkt extracted:', jktCities.length);
}

run();
