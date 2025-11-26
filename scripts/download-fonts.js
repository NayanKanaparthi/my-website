/**
 * Script to download Google Fonts for self-hosting
 * Run with: node scripts/download-fonts.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(process.cwd(), 'public', 'fonts');

// Ensure fonts directory exists
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Direct variable font URLs from Google Fonts
const fonts = [
  {
    name: 'Inter',
    url: 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-roman.var.woff2',
    filename: 'Inter-Variable.woff2'
  },
  {
    name: 'Manrope',
    url: 'https://fonts.gstatic.com/s/manrope/v15/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk6jFO_F.ttf',
    filename: 'Manrope-Variable.woff2'
  },
  {
    name: 'JetBrains Mono',
    url: 'https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yK1jPQ.ttf',
    filename: 'JetBrainsMono-Variable.woff2'
  }
];

async function downloadFont(font) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(fontsDir, font.filename);
    
    console.log(`Downloading ${font.name} from ${font.url}...`);
    
    https.get(font.url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${font.name}: HTTP ${res.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded ${font.name} to ${filePath}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete partial file
        reject(err);
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${font.name}:`, err);
      reject(err);
    });
  });
}

async function downloadAllFonts() {
  console.log('Starting font download...\n');
  
  for (const font of fonts) {
    try {
      await downloadFont(font);
    } catch (error) {
      console.error(`Failed to download ${font.name}:`, error.message);
    }
  }
  
  console.log('\nFont download complete!');
  console.log('Font files are in:', fontsDir);
}

downloadAllFonts().catch(console.error);

