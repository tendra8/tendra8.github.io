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
  const bdg = await fetchHtml('https://buanaraya.com/tarif-kirim-dari-bandung/');
  const jkt = await fetchHtml('https://buanaraya.com/tarif-kirim-asal-jakarta/');
  
  // Extract table rows using regex
  function extractRows(html) {
    const rows = [];
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let match;
    while ((match = trRegex.exec(html)) !== null) {
      const tr = match[1];
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      const cols = [];
      let tdMatch;
      while ((tdMatch = tdRegex.exec(tr)) !== null) {
        // preserve links if any? The old tables didn't have internal links, only buanaweb has them!
        // wait, the user said "link inside site jangan dihilangkan juga ya" 
        // This means I should preserve buanaweb's links!
        cols.push(tdMatch[1].replace(/<[^>]+>/g, '').trim().replace(/&nbsp;/g, ''));
      }
      if (cols.length >= 2 && cols[0].toLowerCase() !== 'tujuan' && cols[0] !== '') {
        rows.push({ kota: cols[0], min: cols[1] });
      }
    }
    return rows;
  }

  const bdgRows = extractRows(bdg);
  const jktRows = extractRows(jkt);

  fs.writeFileSync('bdg.json', JSON.stringify(bdgRows, null, 2));
  fs.writeFileSync('jkt.json', JSON.stringify(jktRows, null, 2));
  console.log('Done scraping. Bdg:', bdgRows.length, 'Jkt:', jktRows.length);
}

run();
