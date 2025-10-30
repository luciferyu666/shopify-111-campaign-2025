const { Liquid } = require('liquidjs');
const fs = require('fs');

async function main() {
  const engine = new Liquid({ extname: '.liquid', cache: false });
  engine.registerFilter('asset_url', (value) => value ? `https://cdn.test/assets/${value}` : '');
  engine.registerFilter('image_url', (value, options = {}) => {
    if (!value) return '';
    const params = new URLSearchParams();
    if (options.width) params.set('width', options.width);
    if (options.height) params.set('height', options.height);
    const query = params.toString();
    return `https://cdn.test/files/${value}${query ? `?${query}` : ''}`;
  });
  engine.registerFilter('parse_json', (value) => {
    try { return JSON.parse(value); } catch { return null; }
  });

  const templateRaw = fs.readFileSync('sections/kv-hero.liquid', 'utf8');
  const template = templateRaw.split('{% schema %}')[0];

  const ctx = {
    section: {
      id: 'main-hero',
      settings: {
        campaign_preset: '111',
        theme_variant: 'dark',
        enable_inview: true,
        content_alignment: 'start',
        overlay_opacity: 30
      },
      blocks: []
    },
    images: {}
  };

  const html = await engine.parseAndRender(template, ctx);
  console.log(html);
}

main();
