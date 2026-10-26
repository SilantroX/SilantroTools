const sharp = require('sharp');
const fs = require('fs');

async function optimizeImages() {
  const input = 'public/logos/logo-con-fondo.jpg';
  
  // 1. Optimized logo 512x512
  await sharp(input)
    .resize(512, 512, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile('public/logos/logo-con-fondo-opt.webp');
  
  // 2. Icon 64x64 for header/footer
  await sharp(input)
    .resize(64, 64, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile('public/logos/logo-icon.webp');

  // 3. Crisp OpenGraph Banner 1200x630 with monochrome card aesthetic
  const ogSvg = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#09090b"/>
      <line x1="0" y1="80" x2="1200" y2="80" stroke="#18181b" stroke-width="1"/>
      <line x1="0" y1="550" x2="1200" y2="550" stroke="#18181b" stroke-width="1"/>
      <line x1="120" y1="0" x2="120" y2="630" stroke="#18181b" stroke-width="1"/>
      <line x1="1080" y1="0" x2="1080" y2="630" stroke="#18181b" stroke-width="1"/>
      
      <g transform="translate(160, 160)">
        <rect width="96" height="96" rx="16" fill="#18181b" stroke="#27272a" stroke-width="2"/>
        <path d="M27 69 L27 27 L48 46 L69 27 L69 69" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="48" cy="65" r="4" fill="#ffffff"/>
      </g>
      
      <text x="280" y="205" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="20" font-weight="600" letter-spacing="4" fill="#a1a1aa" text-anchor="start">SILANTRO LABS / SUITE</text>
      <text x="280" y="245" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1" fill="#fafafa" text-anchor="start">Silantro Tools</text>

      <text x="160" y="345" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="32" font-weight="600" letter-spacing="-0.5" fill="#ffffff">Herramientas de Cómputo Local y Privado</text>
      
      <text x="160" y="395" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="18" fill="#a1a1aa">Generador QR ISO/IEC 18004 • Cero Egreso de Datos • 100% Client-Side</text>
      
      <g transform="translate(160, 445)">
        <rect width="170" height="36" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1"/>
        <text x="85" y="23" font-family="ui-monospace, monospace" font-size="12" font-weight="600" fill="#fafafa" text-anchor="middle">100% IN-BROWSER</text>
      </g>
      <g transform="translate(345, 445)">
        <rect width="180" height="36" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1"/>
        <text x="90" y="23" font-family="ui-monospace, monospace" font-size="12" font-weight="600" fill="#fafafa" text-anchor="middle">ZERO DATA EGRESS</text>
      </g>
      <g transform="translate(540, 445)">
        <rect width="170" height="36" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1"/>
        <text x="85" y="23" font-family="ui-monospace, monospace" font-size="12" font-weight="600" fill="#fafafa" text-anchor="middle">HIGH RES VECTOR</text>
      </g>

      <text x="160" y="585" font-family="ui-monospace, monospace" font-size="13" fill="#71717a">tools.silantrolabs.com</text>
    </svg>
  `);

  await sharp(ogSvg)
    .jpeg({ quality: 90 })
    .toFile('public/logos/og-image.jpg');

  console.log('Optimized images successfully generated:');
  console.log('logo-icon.webp:', fs.statSync('public/logos/logo-icon.webp').size, 'bytes');
  console.log('logo-con-fondo-opt.webp:', fs.statSync('public/logos/logo-con-fondo-opt.webp').size, 'bytes');
  console.log('og-image.jpg:', fs.statSync('public/logos/og-image.jpg').size, 'bytes');
}

optimizeImages().catch(err => {
  console.error('Error generating images:', err);
  process.exit(1);
});
