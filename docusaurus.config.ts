const { themes: prismThemes } = require('prism-react-renderer');
const remarkSocialEmbeds = require('./src/plugins/remark-social-embeds').default;

// Add type for sitemap params
interface SitemapParams {
  defaultCreateSitemapItems: (params: any) => Promise<Array<{url: string}>>;
  [key: string]: any;
}

const config = {
  title: 'Kig.wiki - The Open Kigurumi Mask Guide',
  tagline: 'Your answer to all things Kigurumi',
  favicon: 'icons/favicon.ico',


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
          customCss: require.resolve('./src/css/custom.css'),
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
  ],


};

module.exports = config;
