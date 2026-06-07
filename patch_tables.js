const fs = require('fs');

let content = fs.readFileSync('build.mjs', 'utf8');

// The original 20 cities are already in tarifRows in build.mjs
const originalCities = [
  "Banjarmasin", "Banjarbaru", "Balikpapan", "Samarinda", "Bontang", 
  "Pontianak", "Singkawang", "Palangka Raya", "Tarakan", "Makassar", 
  "Palu", "Kendari", "Manado", "Gorontalo", "Mamuju", "Denpasar", 
  "Jayapura", "Sorong", "Manokwari", "Merauke"
].map(c => c.toLowerCase());

const bdgRaw = JSON.parse(fs.readFileSync('bdg.json', 'utf8'));
// bdgRaw is [{kota: "Adaro", min: "50"}, ...]

const jktRaw = [
"AMBON", "BALIKPAPAN", "BANDUNG", "BANJARBARU", "BANJARMASIN", "BARABAI", "BATAM", "BAU BAU", "BENGKAYANG", "BERAU", "BITUNG", "BONE", "BONTANG", "DENPASAR", "GORONTALO", "GOWA", "JAKARTA", "JAYAPURA", "KENDARI", "KETAPANG", "KOTA BARU", "KUALA KAPUAS", "KUPANG", "LAMPUNG", "LUWUK", "MAKASSAR", "MALANG", "MAMUJU", "MAROS", "MARTAPURA", "MEMPAWAH", "MENADO", "MINAHASA", "PALANGKARAYA", "PALOPO", "PALU", "PANGKALANBUN", "PANGKEP", "PARE PARE", "PARIGI", "PINRANG", "PONTIANAK", "POSO", "RAHA", "SAMARINDA", "SAMBAS", "SAMPIT", "SANGATA", "SANGGAU", "SEKADAU", "SENGKANG", "SIDRAP", "SINGKAWANG", "SINTANG", "SOROAKO", "SURABAYA", "TARAKAN", "TORAJA"
];

// Combine and deduplicate
const extraRows = [];
const seen = new Set(originalCities);

function addCity(name, min) {
  const cleanName = name.trim().toLowerCase().replace('menado', 'manado');
  if (!seen.has(cleanName) && cleanName.length > 2) {
    seen.add(cleanName);
    const capitalized = cleanName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    extraRows.push([capitalized, "-", min + " kg", ""]);
  }
}

for (const row of bdgRaw) {
  let min = parseInt(row.min) || 50;
  addCity(row.kota, min);
}

for (const kota of jktRaw) {
  addCity(kota, 50);
}

// Now extraRows has all the extra cities.
// We need to inject them into build.mjs

// In build.mjs, tarifRows is defined as:
// const tarifRows = [
//   ["Banjarmasin", "Kalimantan Selatan", "10 kg", "kargo-pengiriman-bandung-banjarmasin"],
//   ...
//   ["Merauke", "Papua Selatan", "30 kg", "kargo-bandung-merauke"],
// ];
// We can append our extraRows right before `];`
const extraRowsStr = extraRows.map(r => `  ${JSON.stringify(r)},`).join('\n');

content = content.replace(/(const tarifRows = \[[\s\S]+?)(];)/, `$1${extraRowsStr}\n$2`);

// We also need to update tarifTable to handle empty slug
const newTarifTable = `const tarifTable = \`<div class="table-wrap"><table>
  <thead><tr><th>Kota Tujuan</th><th>Provinsi</th><th>Min. Berat</th><th>Tarif</th></tr></thead>
  <tbody>\${tarifRows.map(([kota, prov, min, slug]) => \`<tr><td>\${slug ? \\\`<a href="/\${slug}/">\${kota}</a>\\\` : kota}</td><td>\${prov}</td><td>\${min}</td><td><a class="btn btn--wa" style="padding:7px 14px;font-size:.85rem" href="\${waLink(WA_BDG, \\\`Halo, minta tarif kirim ke \${kota}\\\`)}">Cek WA</a></td></tr>\`).join("\\n  ")}</tbody>
</table></div>\`;`;

content = content.replace(/const tarifTable = `[\s\S]+?<\/table><\/div>`;/, newTarifTable);

fs.writeFileSync('build.mjs', content, 'utf8');
console.log('build.mjs updated with ' + extraRows.length + ' extra cities!');
