import fs from 'fs/promises';
import path from 'path';
import { globby } from 'globby';

const defaultConfig = {
  baseUrl: 'https://yourdomain.com',
  excludePatterns: [
    '**/_*.tsx',
    '**/_*.js',
    '**/admin/**',
    '**/api/**',
    '**/404.tsx',
    '**/404.js',
    '**/[*.tsx',
    '**/[*.js',
    '**/.*' // hidden files
  ],
  changeFreq: 'weekly',
  priority: 0.7,
  pagesDirectory: 'src/app',
  outputDirectory: 'public'
};

async function generateSitemap(config = {}) {
  const mergedConfig = { ...defaultConfig, ...config };
  
  try {
    // Get all page files
    const pages = await globby([
      `${mergedConfig.pagesDirectory}/**/page.{tsx,js,jsx}`,
      ...mergedConfig.excludePatterns.map(pattern => `!${pattern}`)
    ]);

    const sitemapEntries = pages.map(page => {
      const route = page
        .replace(new RegExp(`^${mergedConfig.pagesDirectory}`), '')
        .replace(/\.(tsx|js|jsx)$/, '')
        .replace(/\/page$/, '')
        .replace(/\[([^\]]+)\]/g, ':$1'); // Convert [param] to :param

      return `
      <url>
        <loc>${mergedConfig.baseUrl}${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${mergedConfig.changeFreq}</changefreq>
        <priority>${mergedConfig.priority}</priority>
      </url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapEntries.join('')}
</urlset>`;

    const robot_txt = 
`User-agent: *
Allow: /
Disallow: /private/

Sitemap: ${mergedConfig.baseUrl}/sitemap.xml`;

    const outputPath = path.join(process.cwd(), mergedConfig.outputDirectory, 'sitemap.xml');
    await fs.writeFile(outputPath, sitemap);
    console.log(`Sitemap generated at ${outputPath}`);

    const outputPathRobotTxt = path.join(process.cwd(), mergedConfig.outputDirectory, 'robots.txt');
    await fs.writeFile(outputPathRobotTxt, robot_txt);
    console.log(`robots.txt generated at ${outputPathRobotTxt}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Configuration for your specific project
const projectConfig = {
  baseUrl: 'https://ryomario.github.io',
  // Add any project-specific overrides here
};

generateSitemap(projectConfig).catch(console.error);