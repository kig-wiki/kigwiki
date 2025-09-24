const { themes: prismThemes } = require('prism-react-renderer');
const remarkSocialEmbeds = require('./src/plugins/remark-social-embeds').default;
const fs = require('fs');
const path = require('path');

// Add type for sitemap params
interface SitemapParams {
  defaultCreateSitemapItems: (params: any) => Promise<Array<{url: string}>>;
  [key: string]: any;
}



const config = {
  title: 'Kig.wiki - Kigurumi Wiki',
  tagline: 'Your answer to all things Kigurumi Masks, Hadatai, and more.',
  favicon: 'icons/favicon.ico',

  // Docusaurus Faster - enables faster build infrastructure
  future: {
    experimental_faster: true,
    v4: true,
  },


  url: 'https://kig.wiki',
  // For GitHub pages deployment, it is often '/<projectName>/'
  // Regular hosting or Cloudflare pages just leave baseurl alone and empty'
  baseUrl: '',
  

  // GitHub pages deployment config.
  // We aren't using GitHub pages, and don't technically need these.
  organizationName: 'kig-wiki', 
  projectName: 'kigwiki',
  deploymentBranch: 'gh-pages',

  // This we do need for sane cannonical paths 
  trailingSlash: true,
  // Quality of life, perhaps worth setting stricter
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      'classic',
      {
        docs: {
          // https://docusaurus.io/docs/sidebar if we ever need to customize the sidebar.
          sidebarPath: require.resolve('./sidebars.js'),
          // our repo url for edit links
          editUrl: 'https://github.com/kig-wiki/kigwiki/blob/main/',
          // Kig.wiki social media embeds
          remarkPlugins: [remarkSocialEmbeds],
          // Using / as the base path for the docs not /docs/
          routeBasePath: '/',
        },
        // We don't have a blog
        blog: false,
        // Custom css for the docs
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/makers-cards.css'),
          ],
        },
        // Sitemap config self explanatory  
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params: SitemapParams) => {
            const {defaultCreateSitemapItems, ...rest} = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item: {url: string}) => !item.url.includes('/page/'));
          },
        },
      },
    ],
  ],

  themeConfig: {
    // Google Discover optimization - enables large image previews in search results
    metadata: [{ name: 'robots', content: 'max-image-preview:large' }],
    
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      // We don't want to respect the system color scheme. Users can still choose just we default to dark.
      respectPrefersColorScheme: false,
    },

    // various images and navbar config
    navbar: {
      title: 'Kigwiki',
      logo: {
        alt: 'Kigwiki Logo',
        src: 'icons/kigwiki.png',
      },
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Home',
              to: '/',
            },
            {
              label: 'Get Started',
              to: '/what-is-kigurumi',
            },
          ],
        },
        {
          title: 'Want to Contribute?',
          items: [
            {
              label: 'Our Github',
              href: 'https://github.com/kig-wiki/kigwiki',
            },
          ],
        },
        {
          items: [
            {
              html: `
              <div class="gull-wrap" aria-label="Gull">
                <img
                  src="/img/gull.webp"
                  alt="Gull staring back at you"
                  width="320"
                  height="153"
                  loading="lazy"
                />
              </div>
            `,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kig.wiki | Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    headTags: [
      {
        tagName: 'link',
        attributes: {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/icons/apple-touch-icon.png',
        },
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/icons/favicon-32x32.png',
        },
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/icons/favicon-16x16.png',
        },
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'mask-icon',
          href: '/icons/safari-pinned-tab.svg',
          color: '#5bbad5',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          name: 'msapplication-TileColor',
          content: '#2b5797',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          name: 'theme-color',
          content: '#ffffff',
        },
      },
    ],
    structuredData: {
      excludedRoutes: ['/tags/**'],
      verbose: true,
      organization: {
        sameAs: [
          'https://github.com/kig-wiki/kigwiki',
        ],
        logo: {
          '@type': 'ImageObject',
          inLanguage: 'en-US',
          '@id': 'https://kig.wiki/#logo',
          url: 'https://kig.wiki/icons/kigwiki.png',
          contentUrl: 'https://kig.wiki/icons/kigwiki.png',
          width: 512,
          height: 512,
        },
      },
      website: {
        inLanguage: 'en-US',
      },
      webpage: {
        inLanguage: 'en-US',
        datePublished: '2024-01-01',
      },
      breadcrumbLabelMap: {
      }
    },
  },

  plugins: [
    [
      require.resolve('docusaurus-lunr-search'),
      {
        languages: ['en', 'ja'],
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/icons/kigwiki.png',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#5b4a91',
          },
        ],
      },
    ],
    require.resolve('./src/plugins/docusaurus-plugin-structured-data'),
    [
      require.resolve('./src/plugins/docusaurus-plugin-maker-data'),
      {
        verbose: true,
      },
    ],
    pluginLlmsTxt,
  ],


};

module.exports = config;

// LLMs.txt functionality. 
// I know some may not like the sound of this, but if they're gonna scrape any/all sites we might as well just dump info in a way that least impacts hosting so they can bugger off.
async function pluginLlmsTxt(context: any) {
  return {
    name: "llms-txt-plugin",
    loadContent: async () => {
      const { siteDir } = context;
      const contentDir = path.join(siteDir, "docs");
      const allMd: string[] = [];

      // recursive function to get all md files
      const getMdFiles = async (dir: string) => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await getMdFiles(fullPath);
          } else if (entry.name.endsWith(".md")) {
            const content = await fs.promises.readFile(fullPath, "utf8");
            
            // Check if this is a makers or hadatai page with React components
            if (content.includes('import { makersData }') || content.includes('import { hadataiData }')) {
              // Replace React component usage with actual data
              let processedContent = content;
              
              // Handle makers data
              if (content.includes('import { makersData }')) {
                try {
                  const makersDataPath = path.join(siteDir, 'src', 'data', 'makers-data.ts');
                  const makersDataContent = await fs.promises.readFile(makersDataPath, 'utf8');
                  
                  // Extract the actual data array from the TypeScript file
                  const makersDataMatch = makersDataContent.match(/export const makersData: Maker\[\] = (\[[\s\S]*?\]);/);
                  if (makersDataMatch) {
                    const makersData = JSON.parse(makersDataMatch[1]);
                    
                    // Create a markdown representation of the makers data
                    const makersMarkdown = `# Kigurumi Mask Makers

This directory contains information about various kigurumi mask makers, their pricing, and contact information.

## Makers

${makersData.map((maker: any) => `
### ${maker.name}${maker.alias ? ` (${maker.alias})` : ''}

- **Status**: ${maker.status}
- **Region**: ${maker.region}
- **Price Range**: ${maker.priceRange}
- **Size**: ${maker.size}
- **Material**: ${maker.materialType}
- **Website**: ${maker.website}
${maker.socials && Object.keys(maker.socials).length > 0 ? `- **Socials**: ${Object.entries(maker.socials).map(([platform, url]) => `${platform}: ${url}`).join(', ')}` : ''}
${maker.features && Object.keys(maker.features).length > 0 ? `- **Features**: ${Object.entries(maker.features).map(([feature, enabled]) => `${feature}: ${enabled ? 'Yes' : 'No'}`).join(', ')}` : ''}
${maker.notes ? `- **Notes**: ${maker.notes}` : ''}
`).join('\n')}`;
                    
                    processedContent = processedContent.replace(
                      /import.*makersData.*\n.*<MakerCards.*\/>/s,
                      makersMarkdown
                    );
                  }
                } catch (error) {
                  console.warn('Could not process makers data:', error);
                }
              }
              
              // Handle hadatai data
              if (content.includes('import { hadataiData }')) {
                try {
                  const hadataiDataPath = path.join(siteDir, 'src', 'data', 'hadatai-data.ts');
                  const hadataiDataContent = await fs.promises.readFile(hadataiDataPath, 'utf8');
                  
                  // Extract the actual data array from the TypeScript file
                  const hadataiDataMatch = hadataiDataContent.match(/export const hadataiData: Hadatai\[\] = (\[[\s\S]*?\]);/);
                  if (hadataiDataMatch) {
                    const hadataiData = JSON.parse(hadataiDataMatch[1]);
                    
                    // Create a markdown representation of the hadatai data
                    const hadataiMarkdown = `# Hadatai Makers

Hadatai (also known as zentai) are full-body suits that are often worn with kigurumi masks. This directory contains information about various hadatai makers, their pricing, and contact information.

## Hadatai Makers

${hadataiData.map((hadatai: any) => `
### ${hadatai.name}

- **Region**: ${hadatai.region}
- **Currency**: ${hadatai.currency}
${hadatai.socials && Object.keys(hadatai.socials).some(key => hadatai.socials[key]) ? `- **Socials**: ${Object.entries(hadatai.socials).filter(([_, url]) => url).map(([platform, url]) => `${platform}: ${url}`).join(', ')}` : ''}
- **Price Examples**:
${hadatai.priceExamples.map((example: any) => `  - ${example.type}: ${example.price}${example.link ? ` - [Link](${example.link})` : ''}`).join('\n')}
${hadatai.notes ? `- **Notes**: ${hadatai.notes}` : ''}
`).join('\n')}`;
                    
                    processedContent = processedContent.replace(
                      /import.*hadataiData.*\n.*<HadataiCards.*\/>/s,
                      hadataiMarkdown
                    );
                  }
                } catch (error) {
                  console.warn('Could not process hadatai data:', error);
                }
              }
              
              allMd.push(processedContent);
            } else {
              allMd.push(content);
            }
          }
        }
      };

      await getMdFiles(contentDir);
      return { allMd };
    },
    postBuild: async ({ content, routes, outDir }: { content: any; routes: any; outDir: string }) => {
      const { allMd } = content as { allMd: string[] };

      // Write concatenated MD content
      const concatenatedPath = path.join(outDir, "llms-full.txt");
      await fs.promises.writeFile(concatenatedPath, allMd.join("\n\n---\n\n"));

      // we need to dig down several layers:
      // find PluginRouteConfig marked by plugin.name === "docusaurus-plugin-content-docs"
      const docsPluginRouteConfig = routes.filter(
        (route: any) => route.plugin.name === "docusaurus-plugin-content-docs"
      )[0];

      // docsPluginRouteConfig has a routes property has a record with the path "/" that contains all docs routes.
      const allDocsRouteConfig = docsPluginRouteConfig.routes?.filter(
        (route: any) => route.path === "/"
      )[0];

      // A little type checking first
      if (!allDocsRouteConfig?.props?.version) {
        return;
      }

      // this route config has a `props` property that contains the current documentation.
      const currentVersionDocsRoutes = (
        allDocsRouteConfig.props.version as Record<string, unknown>
      ).docs as Record<string, Record<string, unknown>>;

      // for every single docs route we now parse a path (which is the key) and a title
      const docsRecords = Object.entries(currentVersionDocsRoutes).map(([path, record]) => {
        return `- [${record.title}](${path}): ${record.description}`;
      });

      // Build up llms.txt file
      const llmsTxt = `# ${context.siteConfig.title}\n\n## Docs\n\n${docsRecords.join("\n")}`;

      // Write llms.txt file
      const llmsTxtPath = path.join(outDir, "llms.txt");
      try {
        fs.writeFileSync(llmsTxtPath, llmsTxt);
      } catch (err) {
        throw err;
      }
    },
  };
}